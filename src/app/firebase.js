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
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter out items that exist in the sale collection
    const filteredItems = [];
    for (const item of items) {
      const saleDoc = await getDoc(doc(db, "sale", item.id));
      if (!saleDoc.exists()) {
        filteredItems.push(item);
      }
    }

    setItems(filteredItems);
  } catch (e) {
    console.error("Error fetching items:", e);
    throw e;
  }
};

export const fetchItemsByIds = async (ids) => {
  try {
    await ensureAuthenticated();
    const items = [];
    for (let id of ids) {
      if (id) {
        const docRef = doc(db, 'item', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Check if item exists in sale collection
          const saleDoc = await getDoc(doc(db, "sale", id));
          if (!saleDoc.exists()) {
            const data = {
              id: docSnap.id,
              ...docSnap.data()
            }
            items.push(data);
          }
        } else {
          console.log("No item with id " + id);
        }
      }
    }
    return items;
  } catch (error) {
    console.error("Error fetching items by IDs:", error);
    throw error;
  }
};

export const fetchItemById = async (id, setItem, itemSold) => {
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

        // Check if item exists in sale collection
        const saleDoc = await getDoc(doc(db, "sale", id));
        if (saleDoc.exists()) {
          if (itemSold) {
            itemSold(data);
          }
          return;
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

export const sellItem = async (item, stripeData, deliveryAddress) => {
  try {
    console.log("Starting sellItem for item:", item.id);
    console.log("Stripe data received:", stripeData);
    console.log("Delivery address received:", deliveryAddress);
    
    await ensureAuthenticated();
    console.log("Authentication successful");
    
    // Create a base sale data object with required fields
    const saleData = {
      itemId: item.id,
      itemName: item.name,
      saleDate: new Date(),
      itemPrice: item.price || 0,
    };

    // Add customer details if available
    if (stripeData?.customer_details) {
      console.log("Adding customer details from Stripe");
      saleData.customerName = stripeData.customer_details.name || "Anonymous";
      if (stripeData.customer_details.email) {
        saleData.customerEmail = stripeData.customer_details.email;
      }
    }

    // Add delivery address if provided
    if (deliveryAddress) {
      console.log("Adding delivery address");
      saleData.deliveryAddress = {
        line1: deliveryAddress.line1,
        line2: deliveryAddress.line2 || '',
        city: deliveryAddress.city,
        postal_code: deliveryAddress.postcode,
        country: deliveryAddress.country
      };
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
    if (stripeData?.payment_method_details) {
      saleData.paymentMethodDetails = stripeData.payment_method_details;
    }

    console.log("Prepared sale data:", saleData);
    const docRef = doc(db, "sale", item.id);
    console.log("Attempting to write to Firestore at path:", docRef.path);
    
    await setDoc(docRef, saleData);
    console.log("Successfully wrote sale to Firestore for item:", item.id);
    return item.id;
  } catch (error) {
    console.error("Error in sellItem function:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    throw error;
  }
};

export const fetchSoldItemDetails = async () => {
  try {
    await ensureAuthenticated();
    // Get all sales
    const salesSnapshot = await getDocs(collection(db, "sale"));
    const itemsSnapshot = await getDocs(collection(db, "item"));
    console.log('DEBUG salesSnapshot.docs:', salesSnapshot.docs);
    console.log('DEBUG itemsSnapshot.docs:', itemsSnapshot.docs);
    const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (sales.length === 0) return [];
    // Get all item IDs that have a sale
    const soldItemIds = sales.map(sale => sale.itemId);
    // Fetch the corresponding items
    const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Create a map for quick lookup
    const itemMap = Object.fromEntries(items.map(item => [item.id, item]));
    // Return merged sale+item objects for each sale
    return sales
      .filter(sale => itemMap[sale.itemId])
      .map(sale => ({ ...sale, ...itemMap[sale.itemId] }));
  } catch (e) {
    console.error("Error fetching sold items:", e);
    throw e;
  }
};

export const fetchSoldItems = async () => {
  try {
    await ensureAuthenticated();
    // Get all sales
    const salesSnapshot = await getDocs(collection(db, "sale"));
    const itemsSnapshot = await getDocs(collection(db, "item"));
    console.log('DEBUG salesSnapshot.docs:', salesSnapshot.docs);
    console.log('DEBUG itemsSnapshot.docs:', itemsSnapshot.docs);
    const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (sales.length === 0) return [];
    // Get all item IDs that have a sale
    const soldItemIds = sales.map(sale => sale.itemId);
    // Fetch the corresponding items
    const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Create a map for quick lookup
    const saleMap = Object.fromEntries(sales.map(sale => [sale.itemId, sale]));
    // Return item fields + saleDate for each sold item
    return items
      .filter(item => saleMap[item.id])
      .map(item => ({ ...item, saleDate: saleMap[item.id].saleDate }));
  } catch (e) {
    console.error("Error fetching sold items:", e);
    throw e;
  }
};

