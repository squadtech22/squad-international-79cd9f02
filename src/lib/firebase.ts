import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyB_RhanJQUvTnSKBegtlC3XB1BV1ULdLbU",
  authDomain: "squad-international.firebaseapp.com",
  projectId: "squad-international",
  storageBucket: "squad-international.firebasestorage.app",
  messagingSenderId: "511894746729",
  appId: "1:511894746729:web:f9fd1a935aaba3d056d4f8",
  measurementId: "G-3N7X9LWZ6T",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
