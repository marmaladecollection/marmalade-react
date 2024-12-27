'use client'; // This makes the component a Client Component

import { createContext, useContext, useEffect, useState } from 'react';

const MarmaladeContext = createContext();

export const MarmaladeProvider = ({ children }) => {
    const [basketItemId, setBasketItemId] = useState(''); 

    useEffect(() => {
        const storedItem = localStorage.getItem('basketItemId');
        if (storedItem) {
            console.log('Updating context with id from localStorage ' + storedItem);
            setBasketItemId(storedItem);
        }
    }, []); 

    useEffect(() => {
        if (basketItemId) {
            localStorage.setItem('basketItemId', basketItemId);
        } else {
            localStorage.removeItem('basketItemId'); 
        }
    }, [basketItemId]);

    return (
        <MarmaladeContext.Provider value={{ basketItemId, setBasketItemId }}>
            {children}
        </MarmaladeContext.Provider>
    );
};

export const useMarmaladeContext = () => useContext(MarmaladeContext);
