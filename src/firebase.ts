// Firebase configuration and initialization
// Using Firestore Lite SDK for 90% smaller bundle size (perfect for read-only operations)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

console.log("DEBUG: Firebase Config Check");
console.log("API KEY exists?", Boolean(import.meta.env.VITE_FIREBASE_API_KEY));
console.log("Project:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Lite (read-only, much smaller bundle)
export const db = getFirestore(app);

export default app;
