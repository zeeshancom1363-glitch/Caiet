// ============================================
// FILE: NotFound.jsx
// WHAT IT DOES: 404 page.
// Used by: App.jsx catch-all route
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-surface">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
                <h1 className="text-8xl font-bold gradient-text font-heading mb-4">404</h1>
                <p className="text-2xl font-heading font-bold text-ink mb-2">Page Not Found</p>
                <p className="text-body mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
                <div className="flex gap-4 justify-center">
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-white rounded-full font-semibold hover:shadow-lg transition">
                        <Home className="w-4 h-4" /> Go Home
                    </Link>
                    <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-ink rounded-full font-semibold hover:bg-gray-200 transition">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
