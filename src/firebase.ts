import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectDatabaseEmulator, getDatabase,  } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectDatabaseEmulator(db, "localhost", 9000);
}