import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9oKyU5LVspCQNtEbuPYsXe9yzvm63A8U",
  authDomain: "lillahi-etimkhana.firebaseapp.com",
  projectId: "lillahi-etimkhana",
  storageBucket: "lillahi-etimkhana.firebasestorage.app",
  messagingSenderId: "777373297360",
  appId: "1:777737297360:web:61c04a82a1098204ea8cd5",
  measurementId: "G-H8ZBFHJE6M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
