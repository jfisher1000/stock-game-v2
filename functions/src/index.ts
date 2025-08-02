import { onCall, onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/pubsub";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * A callable function to place a trade order for a user in a competition.
 * This function is the core of the trading engine and must be secure and transactional.
 */
export const placeOrder = onCall((request) => {
  // Ensure the user is authenticated before proceeding.
  if (!request.auth) {
    throw new onCall.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  // Log the raw request data for debugging.
  logger.info("Received placeOrder request:", { data: request.data, auth: request.auth });

  // TODO: Implement the full trading logic as per the PRD
  // - Validate competition status (active, not expired)
  // - Validate market hours for the given asset type (e.g., stocks vs. crypto)
  // - Perform a Firestore transaction to ensure atomic operations:
  //   1. Read the asset's current price from /market_data/{symbol}.
  //   2. Read the user's participant data to get their cash_balance.
  //   3. Verify the user has sufficient funds (for a buy) or shares (for a sell).
  //   4. Debit/credit the user's cash_balance.
  //   5. Update, create, or delete the asset document in the user's /holdings subcollection.
  //   6. Create a new document in the /transactions subcollection to log the trade.

  const { symbol, quantity, orderType } = request.data;
  const userId = request.auth.uid;

  // Placeholder response for now.
  return {
    success: true,
    message: `Order placed for ${quantity} of ${symbol} for user ${userId}.`,
    details: {
      orderType,
    },
  };
});

/**
 * A scheduled function that runs every minute to update market data for assets
 * that are actively being held in competitions.
 */
export const updateMarketData = onSchedule("every 1 minutes", async (event) => {
  logger.log("Scheduled function 'updateMarketData' is running.");
  // TODO: Implement market data fetching logic
  // - Get a unique list of all symbols currently held across all active competitions.
  // - Fetch the latest prices for these symbols from a financial data API.
  // - Update the /market_data/{symbol} documents in Firestore with the new prices.
  return null;
});


/**
 * An HTTP-triggered function to calculate leaderboards.
 * As per the dev plan, this should ideally be triggered by the completion of
 * updateMarketData, but for now, it's an HTTP endpoint.
 */
export const calculateLeaderboards = onRequest(async (req, res) => {
  logger.log("HTTP function 'calculateLeaderboards' was triggered.");
  // TODO: Implement leaderboard calculation logic
  // - Iterate through all active competitions.
  // - For each participant in a competition:
  //   - Calculate their total portfolio value (cash_balance + value of all holdings).
  //   - Update the 'total_portfolio_value' and 'rank' fields in their participant document.
  res.status(200).send("Leaderboard calculation triggered successfully.");
});
