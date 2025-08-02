import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

// Initialize the Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// --- Configuration ---
// IMPORTANT: Set your Alpha Vantage API key in your Firebase environment
// Run this command in your terminal:
// firebase functions:config:set alphavantage.key="YOUR_API_KEY"
const ALPHA_VANTAGE_API_KEY = functions.config().alphavantage.key;
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Define the assets you want to track
const STOCKS_TO_TRACK = ["AAPL", "GOOGL", "MSFT", "TSLA"];
const CRYPTO_TO_TRACK = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
];

/**
 * A scheduled Cloud Function that runs every 15 minutes to fetch the latest
 * market data for predefined stocks and cryptocurrencies and saves it
 * to the 'market_data' collection in Firestore.
 */
export const updateMarketData = functions
  .runWith({
    // Allocate more memory to handle API calls and data processing
    memory: "512MB",
    // Set a timeout of 60 seconds for the function
    timeoutSeconds: 60,
  })
  .pubsub.schedule("every 15 minutes")
  .onRun(async (context) => {
    functions.logger.info("Starting market data update.", { structuredData: true });

    const batch = db.batch();

    // 1. Fetch and process stock data
    for (const symbol of STOCKS_TO_TRACK) {
      try {
        const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: symbol,
            apikey: ALPHA_VANTAGE_API_KEY,
          },
        });

        const quote = response.data["Global Quote"];
        if (quote && quote["05. price"]) {
          const price = parseFloat(quote["05. price"]);
          const changePercent = parseFloat(quote["10. change percent"].replace("%", ""));

          const docRef = db.collection("market_data").doc(symbol);
          batch.set(docRef, {
            symbol: symbol,
            price: price,
            changePercent: changePercent,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            type: "stock",
          });
          functions.logger.info(`Successfully fetched data for stock: ${symbol}`);
        } else {
          functions.logger.warn(`No data or invalid format for stock: ${symbol}`, response.data);
        }
      } catch (error) {
        functions.logger.error(`Error fetching data for stock: ${symbol}`, error);
      }
    }

    // 2. Fetch and process crypto data
    for (const crypto of CRYPTO_TO_TRACK) {
      try {
        const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
          params: {
            function: "CURRENCY_EXCHANGE_RATE",
            from_currency: crypto.symbol,
            to_currency: "USD",
            apikey: ALPHA_VANTAGE_API_KEY,
          },
        });

        const rateInfo = response.data["Realtime Currency Exchange Rate"];
        if (rateInfo && rateInfo["5. Exchange Rate"]) {
          const price = parseFloat(rateInfo["5. Exchange Rate"]);

          const docRef = db.collection("market_data").doc(crypto.symbol);
          batch.set(docRef, {
            symbol: crypto.symbol,
            name: crypto.name,
            price: price,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            type: "crypto",
          });
          functions.logger.info(`Successfully fetched data for crypto: ${crypto.symbol}`);
        } else {
          functions.logger.warn(`No data or invalid format for crypto: ${crypto.symbol}`, response.data);
        }
      } catch (error) {
        functions.logger.error(`Error fetching data for crypto: ${crypto.symbol}`, error);
      }
    }

    // 3. Commit all updates to Firestore in a single batch
    try {
      await batch.commit();
      functions.logger.info("Successfully committed all market data updates to Firestore.");
    } catch (error) {
      functions.logger.error("Error committing batch to Firestore.", error);
    }
  });

