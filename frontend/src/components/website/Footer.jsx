// ============================================
// FILE: Footer.jsx
// WHAT IT DOES: The website footer with about text,
// quick links, contact info, social icons, and
// newsletter signup. All data from SiteSettings.
// Used by: WebsiteLayout.jsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings, subscribeNewsletter } from '../../api/publicApi';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
    const [settings, setSettings] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSettings().then(res => setSettings(res.data)).catch(() => { });
    }, []);

    // Handle newsletter signup
    async function handleSubscribe(e) {
        e.preventDefault();
        if (!email) return toast.error('Please enter your email');
        setLoading(true);
        try {
            const res = await subscribeNewsletter(email);
            toast.success(res.data.message || 'Subscribed!');
            setEmail('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'Admissions', to: '/admissions' },
        { label: 'Services', to: '/services' },
        { label: 'About Us', to: '/about' },
        { label: 'Blogs', to: '/blogs' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <footer className="bg-ink text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white font-heading">
                                {settings?.siteName || 'CAI&ET'}
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 mb-5">
                            {settings?.footerAboutText || 'Empowering the next generation of tech leaders.'}
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {settings?.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition">
                                    <Facebook className="w-4 h-4" />
                                </a>
                            )}
                            {settings?.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition">
                                    <Instagram className="w-4 h-4" />
                                </a>
                            )}
                            {settings?.linkedinUrl && (
                                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                            {settings?.youtubeUrl && (
                                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-red-600 transition">
                                    <Youtube className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold font-heading text-lg mb-5">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map(link => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm hover:text-white hover:pl-1 transition-all duration-200">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold font-heading text-lg mb-5">Contact Info</h3>
                        <ul className="space-y-4">
                            {settings?.phone && (
                                <li className="flex items-start gap-3 text-sm">
                                    <Phone className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                                    <span>{settings.phone}</span>
                                </li>
                            )}
                            {settings?.email && (
                                <li className="flex items-start gap-3 text-sm">
                                    <Mail className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                                    <a href={`mailto:${settings.email}`} className="hover:text-white transition">{settings.email}</a>
                                </li>
                            )}
                            {settings?.address && (
                                <li className="flex items-start gap-3 text-sm">
                                    <MapPin className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold font-heading text-lg mb-5">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Subscribe to stay updated with our latest courses and news.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2.5 bg-gradient-brand rounded-xl hover:shadow-lg transition disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} {settings?.siteName || 'CAI&ET'}. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500">
                        Powered by <span className="gradient-text font-semibold">CAI&ET</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
