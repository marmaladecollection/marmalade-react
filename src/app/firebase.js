import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, addDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

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


const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in: ", errorCode, errorMessage);
  });



  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("Signed in as " + uid);
      // ...
    } else {
      console.log("Signed out");
      // User is signed out
      // ...
    }
  });

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
  // console.log("fetching items with ids " + ids);
  for (let id of ids) {
    if (id) {
      // console.log("fetching item with id " + id);
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

  // console.log("setting items " + items.map(item => item.name));
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

export const sellItem = async (item, customerName) => {
  try {
    const saleData = {
      itemId: item.id,
      itemName: item.name,
      customerName: customerName,
      saleDate: new Date(),
      price: item.price || 0
    };

    const docRef = await addDoc(collection(db, "sale"), saleData);
    console.log("Sale recorded with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error recording sale: ", error);
    throw error;
  }
};

