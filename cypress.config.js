const { defineConfig } = require('cypress');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    baseUrl: 'http://localhost:3000', // Default to local dev server
    defaultCommandTimeout: 10000, // Increased from default 4000ms for slow network/Firebase
    setupNodeEvents(on, config) {
      // Task to fetch all items from Firestore using dynamic import
      on('task', {
        async fetchAllItems() {
          try {
            // Use dynamic import for ES modules
            const scriptPath = path.join(__dirname, 'scripts', 'fetch-items.js');
            const { default: fetchItems } = await import(scriptPath);
            return await fetchItems();
          } catch (error) {
            // Fallback: import Firebase modules directly
            const { initializeApp } = await import('firebase/app');
            const { getFirestore, collection, getDocs } = await import('firebase/firestore');
            const { getAuth, signInAnonymously } = await import('firebase/auth');
            
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
            const auth = getAuth(app);
            
            await signInAnonymously(auth);
            
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
        }
      });
    },
  },
}); 