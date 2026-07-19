// ============================================
// FILE: main.jsx
// WHAT IT DOES: The very first file React loads.
// Wraps the whole app in BrowserRouter and renders
// the root App component into the #root div.
// ============================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            {/* Toast notifications – shows success/error popups */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '12px',
                        background: '#1E293B',
                        color: '#F8FAFC',
                    },
                }}
            />
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
