import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Initialize the Firebase Admin SDK
initializeApp();
const db = getFirestore();

/**
 * Interface for the data expected from the client when calling this function.
 */
interface PlaceOrderData {
  competitionId: string;
  symbol: string;
  quantity: number; // Positive for buy, negative for sell
  assetType: "stock" | "crypto"; // To check market hours
}

/**
 * A callable function to place a stock or crypto trade within a competition.
 * This function is the authoritative source for all trading logic.
 */
export const placeOrder = onCall<PlaceOrderData>(async (request) => {
  // 1. === AUTHENTICATION & VALIDATION ===
  // Ensure the user is authenticated.
  if (!request.auth) {
    logger.error("User is not authenticated.", {structuredData: true});
    throw new HttpsError(
        "unauthenticated",
        "You must be logged in to place an order.",
    );
  }

  const {competitionId, symbol, quantity, assetType} = request.data;
  const userId = request.auth.uid;

  // Basic data validation.
  if (!competitionId || !symbol || !quantity || !assetType) {
    throw new HttpsError(
        "invalid-argument",
        "Missing required fields for placing an order.",
    );
  }

  // 2. === MARKET HOURS VALIDATION ===
  // As per the PRD, stocks can only be traded during market hours.
  if (assetType === "stock") {
    const now = new Date();
    // Note: This uses server time (UTC). You may need to adjust for your
    // target market's time zone (e.g., ET for NYSE).
    const hours = now.getUTCHours();
    const day = now.getUTCDay(); // Sunday = 0, Saturday = 6

    // Example for ET (UTC-4 during DST): 9:30 AM ET is 13:30 UTC. 4 PM ET is 20:00 UTC.
    const isMarketOpen =
      day >= 1 && day <= 5 && hours >= 13.5 && hours < 20;
    if (!isMarketOpen) {
      throw new HttpsError(
          "failed-precondition",
          "The stock market is currently closed.",
      );
    }
  }

  try {
    // 3. === FIRESTORE TRANSACTION ===
    // Use a transaction to ensure the trade is atomic.
    await db.runTransaction(async (transaction) => {
      // Define document references within the transaction.
      const participantRef = db
          .collection("competitions")
          .doc(competitionId)
          .collection("participants")
          .doc(userId);
      const holdingRef = participantRef.collection("holdings").doc(symbol);
      const marketDataRef = db.collection("market_data").doc(symbol);

      // Fetch the required documents.
      const [participantDoc, holdingDoc, marketDataDoc] =
        await transaction.getAll(
            participantRef,
            holdingRef,
            marketDataRef,
        );

      if (!participantDoc.exists) {
        throw new HttpsError("not-found", "Participant not found.");
      }
      if (!marketDataDoc.exists) {
        throw new HttpsError("not-found", `Market data for ${symbol} not found.`);
      }

      const cashBalance = participantDoc.data()?.cash_balance ?? 0;
      const currentPrice = marketDataDoc.data()?.price ?? 0;
      const totalCost = currentPrice * quantity;

      // --- BUY LOGIC ---
      if (quantity > 0) {
        if (cashBalance < totalCost) {
          throw new HttpsError(
              "failed-precondition",
              "Insufficient funds.",
          );
        }
        // Debit cash.
        transaction.update(participantRef, {
          cash_balance: cashBalance - totalCost,
        });

        // Update holdings.
        if (holdingDoc.exists) {
          const existingQty = holdingDoc.data()?.quantity ?? 0;
          transaction.update(holdingRef, {quantity: existingQty + quantity});
        } else {
          transaction.set(holdingRef, {quantity: quantity});
        }
      }
      // --- SELL LOGIC ---
      else { // quantity < 0
        const sharesToSell = Math.abs(quantity);
        const existingQty = holdingDoc.data()?.quantity ?? 0;

        if (!holdingDoc.exists || existingQty < sharesToSell) {
          throw new HttpsError(
              "failed-precondition",
              "Insufficient shares to sell.",
          );
        }
        // Credit cash.
        transaction.update(participantRef, {
          cash_balance: cashBalance - totalCost, // totalCost is negative
        });

        // Update holdings.
        if (existingQty === sharesToSell) {
          transaction.delete(holdingRef); // Delete if selling all shares
        } else {
          transaction.update(holdingRef, {quantity: existingQty - sharesToSell});
        }
      }

      // 4. === LOG THE TRANSACTION ===
      const transactionLogRef = participantRef.collection("transactions").doc();
      transaction.set(transactionLogRef, {
        symbol,
        quantity,
        price: currentPrice,
        total: totalCost,
        timestamp: new Date(),
        type: quantity > 0 ? "buy" : "sell",
      });
    });

    logger.info(`Trade successfully placed for ${userId}`, {
      competitionId,
      symbol,
      quantity,
    });
    return {success: true, message: "Order placed successfully."};
  } catch (error) {
    logger.error("Error placing order:", error);
    // Re-throw HttpsError or wrap other errors.
    if (error instanceof HttpsError) {
      throw error;
    } else {
      throw new HttpsError("internal", "An internal error occurred.");
    }
  }
});
