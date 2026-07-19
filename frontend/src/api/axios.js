// ============================================
// FILE: axios.js
// WHAT IT DOES: Creates a shared Axios instance
// with the base URL and auth token auto-attached.
// All API files import this instead of raw axios.
// Used by: every file in src/api/
// ============================================
import axios from 'axios';

// Create axios instance pointing to our backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',  // Vercel uses VITE_API_URL, localhost uses /api proxy
});

// Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('caiet_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If we get a 401 (unauthorized), redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only redirect if we're on an admin page
            if (window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login') {
                localStorage.removeItem('caiet_token');
                localStorage.removeItem('caiet_admin');
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
