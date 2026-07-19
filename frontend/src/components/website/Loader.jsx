// ============================================
// FILE: Loader.jsx
// WHAT IT DOES: A beautiful loading spinner shown
// while pages are lazy-loading. Uses the brand
// gradient colors.
// Used by: App.jsx Suspense fallback
// ============================================
import React from 'react';

export default function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4">
                {/* Spinning gradient ring */}
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin" />
                <p className="text-body font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
