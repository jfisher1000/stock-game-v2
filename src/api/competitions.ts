// src/api/competitions.ts
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthStore } from "@/store/auth";

// Define the structure of a Competition object for type safety
export interface Competition {
  id: string;
  name: string;
  startingCapital: number;
  // Add other competition fields here as needed
  // e.g., createdBy: string;
}

/**
 * Fetches all competitions that the current user is a participant in.
 * @throws {Error} If the user is not authenticated.
 * @returns {Promise<Competition[]>} A promise that resolves to an array of competitions.
 */
export const fetchUserCompetitions = async (): Promise<Competition[]> => {
  // Get the current user from the auth store.
  // Zustand's getState() allows us to access the store outside of a React component.
  const { user } = useAuthStore.getState();

  if (!user) {
    // This should ideally not be reached if called from a protected route,
    // but it's a good safeguard.
    throw new Error("User is not authenticated.");
  }

  // Create a query to get all documents from the 'competitions' collection
  // where the user's ID is present in the 'participants' array.
  // NOTE: Firestore's 'array-contains' is efficient for this type of query.
  const competitionsRef = collection(db, "competitions");
  const q = query(competitionsRef, where("participants", "array-contains", user.uid));

  const querySnapshot = await getDocs(q);

  // Map the document snapshots to our Competition type
  const competitions = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Competition[];

  return competitions;
};
