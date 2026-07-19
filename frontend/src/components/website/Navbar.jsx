// ============================================
// FILE: Navbar.jsx
// WHAT IT DOES: The main navigation bar. Shows
// logo, site name, nav links, and Apply Now button.
// Sticky with blur on scroll. Hamburger on mobile.
// All content comes from SiteSettings in the DB.
// Used by: WebsiteLayout.jsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getSettings } from '../../api/publicApi';
import { Menu, X, GraduationCap } from 'lucide-react';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/admissions', label: 'Admissions' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/blogs', label: 'Blogs' },
    { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [settings, setSettings] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Load site settings
    useEffect(() => {
        getSettings()
            .then(res => setSettings(res.data))
            .catch(() => { });
    }, []);

    // Detect scroll to add blur background
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100'
                    : 'bg-white'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo + Site Name */}
                    <Link to="/" className="flex items-center gap-3 group">
                        {settings?.logoImage ? (
                            <img src={settings.logoImage} alt="Logo" className="h-10 w-10 object-contain" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-bold font-heading gradient-text group-hover:opacity-80 transition">
                                {settings?.siteName || 'CAI&ET'}
                            </h1>
                            <p className="text-[10px] text-body -mt-0.5 hidden sm:block">
                                {settings?.tagline || 'AI & Emerging Technologies'}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) =>
                                    `px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-brand text-white shadow-md'
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Apply Now Button + Hamburger */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/apply"
                            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-primary-600/25 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Apply Now
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
                                        ? 'bg-gradient-brand text-white'
                                        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <Link
                            to="/apply"
                            onClick={() => setMobileOpen(false)}
                            className="block w-full text-center px-4 py-3 bg-gradient-brand text-white rounded-xl text-sm font-semibold mt-2"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
