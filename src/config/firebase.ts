import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration from .env files
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// This block connects to the local Firebase emulators when
// running in development mode. This is the code we've just added.
// `import.meta.env.DEV` is a variable provided by Vite.
if (import.meta.env.DEV) {
  console.log("✅ Development mode: Connecting to local Firebase emulators.");

  // Point to the Auth emulator
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

  // Point to the Firestore emulator
  connectFirestoreEmulator(db, "127.0.0.1", 8080);

  // Point to the Functions emulator
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// Export the services for use throughout your app
export { app, auth, db, functions };
