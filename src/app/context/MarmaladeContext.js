'use client'; // This makes the component a Client Component

import { createContext, useContext, useEffect, useState } from 'react';

const MarmaladeContext = createContext();

export const MarmaladeProvider = ({ children }) => {
    const [message, setMessage] = useState(''); 

    useEffect(() => {
        const storedMessage = localStorage.getItem('message');
        if (storedMessage) {
            setMessage(storedMessage);
        }
    }, []); 


    useEffect(() => {
        if (message) {
            localStorage.setItem('message', message);
        } else {
            localStorage.removeItem('message'); 
        }
    }, [message]);

    return (
        <MarmaladeContext.Provider value={{ message, setMessage }}>
            {children}
        </MarmaladeContext.Provider>
    );
};

export const useMarmaladeContext = () => useContext(MarmaladeContext);
