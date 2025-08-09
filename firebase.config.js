import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBS95dFmnUKz15WaBU9VCfhLfwTG_wlepE",
  authDomain: "let-it-out-9ff7a.firebaseapp.com",
  projectId: "let-it-out-9ff7a",
  storageBucket: "let-it-out-9ff7a.firebasestorage.app",
  messagingSenderId: "764234531077",
  appId: "1:764234531077:web:f3b085f8c49339ac26376c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
