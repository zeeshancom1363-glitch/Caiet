// ============================================
// FILE: ProtectedRoute.jsx
// WHAT IT DOES: Checks if admin is logged in.
// If not, redirects to /admin/login.
// Used by: App.jsx
// ============================================
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
