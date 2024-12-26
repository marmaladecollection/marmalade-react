import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, getDocs } from "firebase/firestore"; // Import Firestore methods
import { collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDO9_iM3sha-AigKFyha1uc07EQNFxAhyo",
    authDomain: "marmalade-5ae5d.firebaseapp.com",
    projectId: "marmalade-5ae5d",
    storageBucket: "marmalade-5ae5d.firebasestorage.app",
    messagingSenderId: "128262757682",
    appId: "1:128262757682:web:84a5c6989424c52aeacb2b",
    measurementId: "G-XR3QK3YRLK"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchAllItems = async (setItems) => {
    try {
      const querySnapshot = await getDocs(collection(db, "item"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (e) {
      console.error("Error fetching items:", e);
    }
  };

export const fetchItemById = async(id, setItem) =>{
  try {
    const docRef = doc(db, 'item', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Item data:", docSnap.data());
      setItem(docSnap.data())
    } else {
      console.log("No item with id " + id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching item " + id, error);
    throw error;
  }
}
