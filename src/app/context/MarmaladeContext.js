'use client'; 
import { createContext, useContext, useEffect, useState } from 'react';

const MarmaladeContext = createContext();

export const MarmaladeProvider = ({ children }) => {
    const [basketIds, setBasketIds] = useState([]);

    // Effect to read from local storage on mount and handle storage events
    useEffect(() => {
        const loadBasketIds = () => {
            try {
                const savedIds = localStorage.getItem('BasketIds');
                if (savedIds) {
                    const parsedIds = JSON.parse(savedIds);
                    setBasketIds(Array.isArray(parsedIds) ? parsedIds : []);
                }
            } catch (error) {
                console.error('Error loading basket IDs:', error);
                setBasketIds([]);
            }
        };

        // Load initial state
        loadBasketIds();

        // Listen for storage events
        const handleStorageChange = (e) => {
            if (e.key === 'BasketIds') {
                loadBasketIds();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup listener on unmount
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Effect to write to local storage whenever ids change
    useEffect(() => {
        try {
            localStorage.setItem('BasketIds', JSON.stringify(basketIds));
        } catch (error) {
            console.error('Error saving basket IDs:', error);
        }
    }, [basketIds]);

    // Function to add an ID
    const addToBasket = (newId) => {
        setBasketIds((prevIds) => [...prevIds, newId]);
    };

    // Function to remove an ID
    const removeFromBasket = (idToRemove) => {
        setBasketIds((prevIds) => prevIds.filter(id => id !== idToRemove));
    };

    // Function to clear the basket
    const clearBasket = () => {
        setBasketIds([]);
    };

    return (
        <MarmaladeContext.Provider value={{ basketIds, addToBasket, removeFromBasket, clearBasket }}>
            {children}
        </MarmaladeContext.Provider>
    );
};

export const useMarmaladeContext = () => useContext(MarmaladeContext);
