import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, addDoc, setDoc } from "firebase/firestore";
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

// Track authentication state
let currentUser = null;

// Check if we're in a test environment
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Initialize auth state listener (skip in test environment)
if (!isTestEnvironment) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      console.log("Signed in as", user.uid);
    } else {
      console.log("Signed out");
    }
  });
}

// Export auth functions
export const signIn = async () => {
  if (isTestEnvironment) return true;
  
  try {
    await signInAnonymously(auth);
    return true;
  } catch (error) {
    console.error("Error signing in:", error);
    return false;
  }
};

// Helper to ensure we're authenticated before operations
const ensureAuthenticated = async () => {
  if (isTestEnvironment) return;
  
  if (!currentUser) {
    const success = await signIn();
    if (!success) {
      throw new Error("Failed to authenticate");
    }
  }
};

export const fetchAllItems = async (setItems) => {
  try {
    await ensureAuthenticated();
    const querySnapshot = await getDocs(collection(db, "item"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(data);
  } catch (e) {
    console.error("Error fetching items:", e);
    throw e;
  }
};

export const fetchItemsByIds = async (ids, setItems) => {
  try {
    await ensureAuthenticated();
    const items = [];
    for (let id of ids) {
      if (id) {
        const docRef = doc(db, 'item', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = {
            id: docSnap.id,
            ...docSnap.data()
          }
          items.push(data);
        } else {
          console.log("No item with id " + id);
        }
      }
    }
    setItems(items);
  } catch (error) {
    console.error("Error fetching items by IDs:", error);
    throw error;
  }
};

export const fetchItemById = async (id, setItem) => {
  try {
    await ensureAuthenticated();
    if (id) {
      const docRef = doc(db, 'item', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data()
        }
        setItem(data);
      } else {
        console.log("No item with id " + id);
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching item " + id, error);
    throw error;
  }
};

export const sellItem = async (item, stripeData, basketId) => {
  try {
    await ensureAuthenticated();
    
    // Create a base sale data object with required fields
    const saleData = {
      basketId: basketId,
      itemId: item.id,
      itemName: item.name,
      saleDate: new Date(),
      itemPrice: item.price || 0,
    };

    // Add customer details if available
    if (stripeData?.customer_details) {
      saleData.customerName = stripeData.customer_details.name || "Anonymous";
      if (stripeData.customer_details.email) {
        saleData.customerEmail = stripeData.customer_details.email;
      }
      if (stripeData.customer_details.address) {
        saleData.customerAddress = stripeData.customer_details.address;
      }
    }

    // Add payment details if available
    if (stripeData?.amount_total) {
      saleData.paymentAmount = stripeData.amount_total / 100;
    }
    if (stripeData?.id) {
      saleData.stripeSessionId = stripeData.id;
    }
    if (stripeData?.payment_intent) {
      saleData.paymentIntentId = stripeData.payment_intent;
    }
    if (stripeData?.payment_status) {
      saleData.paymentStatus = stripeData.payment_status;
    }
    if (stripeData?.payment_method_types?.[0]) {
      saleData.paymentMethod = stripeData.payment_method_types[0];
    }
    if (stripeData?.currency) {
      saleData.currency = stripeData.currency;
    }
    if (stripeData?.customer) {
      saleData.customerId = stripeData.customer;
    }
    if (stripeData?.customer_details?.phone) {
      saleData.phone = stripeData.customer_details.phone;
    }
    if (stripeData?.shipping?.address) {
      saleData.shippingAddress = stripeData.shipping.address;
    }
    if (stripeData?.payment_method_details) {
      saleData.paymentMethodDetails = stripeData.payment_method_details;
    }

    const docRef = doc(db, "sale", basketId);
    await setDoc(docRef, saleData);
    console.log("Sale recorded with ID: ", basketId);
    return basketId;
  } catch (error) {
    console.error("Error recording sale: ", error);
    throw error;
  }
};

