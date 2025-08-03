import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK, which allows for server-side access
admin.initializeApp();
const db = admin.firestore();

// Define the structure for the data we expect from the client
interface CreateCompetitionData {
  name: string;
}

// This is a "Callable Function", meaning the client can invoke it directly.
export const createCompetition = onCall(async (request) => {
  // 1. Authentication Check: Ensure the user is logged in.
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to create a competition."
    );
  }

  const uid = request.auth.uid;
  const { name } = request.data as CreateCompetitionData;
  const startingCash = 100000; // Default starting cash as per PRD

  // 2. Validation: Check the data sent from the client.
  if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 50) {
    throw new HttpsError(
      "invalid-argument",
      "Competition name must be a string between 1 and 50 characters."
    );
  }

  logger.info(`User ${uid} is creating competition "${name}" with starting cash ${startingCash}`);

  try {
    // 3. Create Competition and Participant in a Batch Write
    // A batch write is an "all-or-nothing" operation. It ensures that we either
    // create BOTH the competition and the participant document, or NEITHER.
    // This prevents data inconsistencies.
    const batch = db.batch();

    // Create a reference for the new competition document
    const competitionRef = db.collection("competitions").doc();

    // Define the data for the new competition
    batch.set(competitionRef, {
      name: name,
      creatorId: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      startingCash: startingCash,
      participantCount: 1,
    });

    // Create a reference for the creator's participant document
    const participantRef = competitionRef.collection("participants").doc(uid);

    // Define the data for the creator as the first participant
    batch.set(participantRef, {
      cash_balance: startingCash,
      total_portfolio_value: startingCash, // Initially, value is just cash
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      // We don't need to store holdings or transactions yet
    });

    // 4. Commit the Batch
    // Atomically write both documents to the database.
    await batch.commit();

    logger.info(`Successfully created competition ${competitionRef.id}`);

    // 5. Return a Success Response
    // Send the new competition's ID back to the client.
    return {
      status: "success",
      message: "Competition created successfully!",
      competitionId: competitionRef.id,
    };
  } catch (error) {
    logger.error("Error creating competition:", error);
    // Throw a generic error to the client to avoid exposing server implementation details.
    throw new HttpsError(
      "internal",
      "An unexpected error occurred while creating the competition."
    );
  }
});
