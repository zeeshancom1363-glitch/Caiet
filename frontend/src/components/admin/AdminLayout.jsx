// ============================================
// FILE: AdminLayout.jsx
// WHAT IT DOES: The admin panel layout with sidebar
// navigation, topbar, and outlet for child pages.
// Used by: App.jsx (wraps all /admin/* routes)
// ============================================
import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, BookOpen, GraduationCap, Users, Briefcase,
    FileText, MessageSquare, Mail, Settings, LogOut, Menu, X,
    ChevronDown, Layers, UserCog, ClipboardList, Megaphone,
    Tag, User, HelpCircle, Image, Globe, Lock, Newspaper,
} from 'lucide-react';

const sidebarGroups = [
    {
        label: 'Main',
        items: [
            { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ],
    },
    {
        label: 'Courses',
        items: [
            { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
            { to: '/admin/course-categories', icon: Tag, label: 'Categories' },
            { to: '/admin/instructors', icon: User, label: 'Instructors' },
        ],
    },
    {
        label: 'Admissions',
        items: [
            { to: '/admin/applications', icon: ClipboardList, label: 'Applications' },
            { to: '/admin/students', icon: GraduationCap, label: 'Students' },
        ],
    },
    {
        label: 'Services',
        items: [
            { to: '/admin/services', icon: Briefcase, label: 'Services' },
            { to: '/admin/service-categories', icon: Layers, label: 'Categories' },
            { to: '/admin/services-page-settings', icon: Globe, label: 'Page Settings' },
        ],
    },
    {
        label: 'Content',
        items: [
            { to: '/admin/blog-posts', icon: FileText, label: 'Blog Posts' },
            { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
            { to: '/admin/team-members', icon: Users, label: 'Team Members' },
            { to: '/admin/about-section', icon: Image, label: 'About Section' },
            { to: '/admin/banner-settings', icon: Megaphone, label: 'Banner' },
        ],
    },
    {
        label: 'Inbox',
        items: [
            { to: '/admin/contact-messages', icon: MessageSquare, label: 'Messages' },
            { to: '/admin/newsletter', icon: Newspaper, label: 'Newsletter' },
        ],
    },
    {
        label: 'Settings',
        items: [
            { to: '/admin/site-settings', icon: Settings, label: 'Site Settings' },
            { to: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
            { to: '/admin/admin-users', icon: UserCog, label: 'Admin Users' },
            { to: '/admin/change-password', icon: Lock, label: 'Password' },
        ],
    },
];

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate('/admin/login');
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-gray-800">
                <Link to="/admin/dashboard" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white font-heading">CAI&ET</h1>
                        <p className="text-[10px] text-gray-400">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {sidebarGroups.map(group => (
                    <div key={group.label}>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-3 mb-2">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                            ? 'bg-primary-600/20 text-primary-400 font-medium'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <item.icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 bg-gray-900 fixed inset-y-0 left-0 z-30 overflow-hidden">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 z-50">
                        {sidebarContent}
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 ml-auto">
                        <Link to="/" target="_blank" className="text-xs text-primary-600 hover:underline">View Site →</Link>
                        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                                {admin?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{admin?.name || 'Admin'}</p>
                                <p className="text-[10px] text-gray-500 capitalize">{admin?.role || 'editor'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
