// Import the necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your existing Firebase config object
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// NEW: Add this block to connect to the emulators in a local environment
if (window.location.hostname === "localhost") {
  console.log("Development mode: Connecting to local Firebase emulators.");
  // Point to the Auth emulator
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  // Point to the Firestore emulator
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  // Point to the Functions emulator
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// Export the services for use in your app
export { auth, db, functions };
