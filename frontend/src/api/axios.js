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
    // In production (Vercel), point directly to the deployed Railway backend!
    // In local development, use '/api' so Vite proxies to localhost:5000.
    baseURL: import.meta.env.PROD
        ? 'https://airy-art-production-4ad7.up.railway.app/api'
        : '/api',
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
    (response) => {
        if (response.data) fixImageUrls(response.data);
        return response;
    },
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

// Helper to recursively fix image paths in all API responses
const BASE_DOMAIN = import.meta.env.PROD ? 'https://airy-art-production-4ad7.up.railway.app' : 'http://localhost:5000';

function fixImageUrls(data) {
    if (!data) return;
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            if (typeof item === 'string' && item.startsWith('/uploads/')) {
                data[index] = `${BASE_DOMAIN}${item}`;
            } else if (typeof item === 'object') {
                fixImageUrls(item);
            }
        });
    } else if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string' && data[key].startsWith('/uploads/')) {
                data[key] = `${BASE_DOMAIN}${data[key]}`;
            } else if (typeof data[key] === 'object') {
                fixImageUrls(data[key]);
            }
        });
    }
}

export default api;
