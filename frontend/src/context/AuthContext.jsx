// ============================================
// FILE: AuthContext.jsx
// WHAT IT DOES: Keeps track of whether an admin
// is logged in. Stores the JWT token and admin
// info. Every admin page checks this context.
// Used by: App.jsx, admin pages, ProtectedRoute
// ============================================
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context — this is like a global variable for React
const AuthContext = createContext(null);

// This component wraps the whole app and provides auth info
export function AuthProvider({ children }) {
    // Try to load saved login from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('caiet_token'));
    const [admin, setAdmin] = useState(() => {
        const saved = localStorage.getItem('caiet_admin');
        return saved ? JSON.parse(saved) : null;
    });

    // Login function — saves token and admin info
    function login(tokenValue, adminData) {
        setToken(tokenValue);
        setAdmin(adminData);
        localStorage.setItem('caiet_token', tokenValue);
        localStorage.setItem('caiet_admin', JSON.stringify(adminData));
    }

    // Logout function — clears everything
    function logout() {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('caiet_token');
        localStorage.removeItem('caiet_admin');
    }

    // Is the admin currently logged in?
    const isAuthenticated = !!token;

    // All these values will be available to any component
    const value = { token, admin, isAuthenticated, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook — use this in any component to access auth info
// Example: const { admin, logout } = useAuth();
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}

export default AuthContext;
