// src/context/MyContext.js
'use client'; // This makes the component a Client Component

import { createContext, useContext, useState, useEffect } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const [message, setMessage] = useState(''); // Start with an empty string

    // Use useEffect to sync with localStorage on client mount
    useEffect(() => {
        const storedMessage = localStorage.getItem('message');
        if (storedMessage) {
            setMessage(storedMessage);
        }
    }, []); // Empty dependency array means this runs once on mount

    // Update localStorage whenever message changes
    useEffect(() => {
        if (message) {
            localStorage.setItem('message', message);
        } else {
            localStorage.removeItem('message'); // Clear if empty
        }
    }, [message]);

    return (
        <MyContext.Provider value={{ message, setMessage }}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyContext = () => useContext(MyContext);
