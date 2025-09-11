import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration for your project (analytics removed)
const firebaseConfig = {
  apiKey: "AIzaSyCZEHX0W0LHSkwJdDUdz82-n4XwYdJqdY0",
  authDomain: "manage-a0f99.firebaseapp.com",
  projectId: "manage-a0f99",
  storageBucket: "manage-a0f99.appspot.com",
  messagingSenderId: "284206270474",
  appId: "1:284206270474:web:f246ac83064849d45937f3",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { db };
export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    app = getApps()[0];
    if (!db) {
      db = getFirestore(app);
    }
  }
  return { app, db };
}