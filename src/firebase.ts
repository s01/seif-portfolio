// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6YKm0PpgfVZbAijvVHB0FS0o2wZHoxrA",
  authDomain: "seif-portfolio-abe7a.firebaseapp.com",
  projectId: "seif-portfolio-abe7a",
  storageBucket: "seif-portfolio-abe7a.firebasestorage.app",
  messagingSenderId: "649557493606",
  appId: "1:649557493606:web:1798b5152e6694d93feaa7",
  measurementId: "G-52J0C1Y9JP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
