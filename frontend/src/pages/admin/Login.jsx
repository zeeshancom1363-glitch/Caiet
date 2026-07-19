// ============================================
// FILE: Login.jsx
// WHAT IT DOES: Admin login page.
// Used by: App.jsx route "/admin/login"
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../api/adminApi';
import { GraduationCap, Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    if (isAuthenticated) {
        navigate('/admin/dashboard', { replace: true });
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) return toast.error('Please fill all fields');
        setLoading(true);
        try {
            const res = await adminLogin({ email, password });
            login(res.data.token, res.data.admin);
            toast.success('Welcome back!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white font-heading">CAI&ET Admin</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to manage your academy</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 space-y-5">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none text-sm transition"
                                placeholder="admin@caiet.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none text-sm transition"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-brand text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : <><LogIn className="w-4 h-4" /> Sign In</>}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-6">
                    Default: admin@caiet.com / Admin@123
                </p>
            </div>
        </div>
    );
}
