import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAy3UOEf3Occ9dRnfO8i-NawSc81jMuIY",
  authDomain: "marmalade-collection.firebaseapp.com",
  projectId: "marmalade-collection",
  storageBucket: "marmalade-collection.firebasestorage.app",
  messagingSenderId: "113362983488",
  appId: "1:113362983488:web:b3e93cb5f68e4996711da5",
  measurementId: "G-8BBEVMWJ3L"
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

export const fetchItemsByIds = async (ids, setItems) => {
  var items = []
  console.log("fetching items with ids " + ids);
  for (let id of ids) {
    if (id) {
      console.log("fetching item with id " + id);
      const docRef = doc(db, 'item', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data()
        }
        items.push(data)
      } else {
        console.log("No item with id " + id);
      }
    }
  }

  console.log("setting items " + items.map(item => item.name));
  setItems(items)
}

export const fetchItemById = async (id, setItem) => {
  try {
    if (id) {
      console.log("fetching item with id " + id);
      const docRef = doc(db, 'item', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data()
        }
        setItem(data)
      } else {
        console.log("No item with id " + id);
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching item " + id, error);
    throw error;
  }
}
