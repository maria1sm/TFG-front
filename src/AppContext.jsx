// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AppContext.Provider>
    );
};
