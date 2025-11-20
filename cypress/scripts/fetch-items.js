// Node script to fetch items from Firestore for Cypress tests
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAy3UOEf3Occ9dRnfO8i-NawSc81jMuIY",
  authDomain: "marmalade-collection.firebaseapp.com",
  projectId: "marmalade-collection",
  storageBucket: "marmalade-collection.firebasestorage.app",
  messagingSenderId: "113362983488",
  appId: "1:113362983488:web:b3e93cb5f68e4996711da5",
  measurementId: "G-8BBEVMWJ3L"
};

export default async function fetchAllItems() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  // Sign in anonymously
  await signInAnonymously(auth);
  
  // Query all items
  const querySnapshot = await getDocs(collection(db, "item"));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return items;
}

