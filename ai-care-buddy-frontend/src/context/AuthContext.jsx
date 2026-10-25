import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, verify the token here
        if (token) {
            setUser({ name: 'User' }); // Mocked initially
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Login err", e);
            return false;
        }
    };

    const register = async (name, email, password, mobile = '', bloodGroup = '', emergencyContactName = '', emergencyContactPhone = '', emergencyContactEmail = '') => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, mobile, bloodGroup, emergencyContactName, emergencyContactPhone, emergencyContactEmail })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Reg err", e);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
