// ============================================
// FILE: WebsiteLayout.jsx
// WHAT IT DOES: Wraps all public pages with the
// BannerBar, Navbar, and Footer. Uses React Router's
// <Outlet> to render the current page in between.
// Used by: App.jsx
// ============================================
import React from 'react';
import { Outlet } from 'react-router-dom';
import BannerBar from './BannerBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function WebsiteLayout() {
    const { pathname } = useLocation();

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <BannerBar />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
