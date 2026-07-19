// ============================================
// FILE: BannerBar.jsx
// WHAT IT DOES: The announcement bar at the very
// top of every page. Shows text from BannerSettings.
// Hidden when isActive is false.
// Used by: WebsiteLayout.jsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBanner } from '../../api/publicApi';
import { Megaphone, X } from 'lucide-react';

export default function BannerBar() {
    const [banner, setBanner] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        getBanner()
            .then(res => setBanner(res.data))
            .catch(() => { });
    }, []);

    // Don't show if: no data, turned off, or user dismissed it
    if (!banner || !banner.isActive || dismissed) return null;

    return (
        <div className="bg-gradient-brand text-white text-sm py-2.5 px-4 relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                <Megaphone className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{banner.mainText}</span>
                {banner.highlightText && (
                    <Link
                        to={banner.linkUrl || '/apply'}
                        className="inline-block bg-accent text-ink px-3 py-0.5 rounded-full text-xs font-bold hover:scale-105 transition-transform"
                    >
                        {banner.highlightText}
                    </Link>
                )}
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition"
                    aria-label="Dismiss banner"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
