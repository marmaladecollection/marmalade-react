// context/MyContext.js
import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const [message, setMessage] = useState('');

    return (
        <MyContext.Provider value={{ message, setMessage }}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyContext = () => useContext(MyContext);
