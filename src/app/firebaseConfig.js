// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, getDocs } from "firebase/firestore"; // Import Firestore methods
import { collection } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDO9_iM3sha-AigKFyha1uc07EQNFxAhyo",
    authDomain: "marmalade-5ae5d.firebaseapp.com",
    projectId: "marmalade-5ae5d",
    storageBucket: "marmalade-5ae5d.firebasestorage.app",
    messagingSenderId: "128262757682",
    appId: "1:128262757682:web:84a5c6989424c52aeacb2b",
    measurementId: "G-XR3QK3YRLK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

export const fetchData = async (setItems) => {
    try {
      const querySnapshot = await getDocs(collection(db, "item"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (e) {
      console.error("Error fetching documents:", e);
    }
  };


export const fetchItemById = async(id, setItem) =>{
  try {
    // Create a reference to the document
    const docRef = doc(db, 'item', id);

    // Fetch the document snapshot
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data()); // Log the document data
      var res = docSnap.data(); // Return the document data
      setItem(res)
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Handle errors as needed
  }
}
