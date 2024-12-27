'use client'; 
import { createContext, useContext, useEffect, useState } from 'react';

const MarmaladeContext = createContext();

export const MarmaladeProvider = ({ children }) => {
    const [basketIds, setBasketIds] = useState([]);

    // Effect to read from local storage on mount
    useEffect(() => {
        const savedIds = localStorage.getItem('BasketIds');
        if (savedIds) {
            setBasketIds(JSON.parse(savedIds));
        }
    }, []);

    // Effect to write to local storage whenever ids change
    useEffect(() => {
        localStorage.setItem('BasketIds', JSON.stringify(basketIds));
    }, [basketIds]);

    // Function to add an ID
    const addToBasket = (newId) => {
        setBasketIds((prevIds) => [...prevIds, newId]);
    };

    // Function to remove an ID
    const removeFromBasket = (idToRemove) => {
        setBasketIds((prevIds) => prevIds.filter(id => id !== idToRemove));
    };

    return (
        <MarmaladeContext.Provider value={{ basketIds, addToBasket, removeFromBasket }}>
            {children}
        </MarmaladeContext.Provider>
    );
};


export const useMarmaladeContext = () => useContext(MarmaladeContext);
