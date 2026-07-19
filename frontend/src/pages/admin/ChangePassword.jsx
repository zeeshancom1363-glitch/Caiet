// ============================================
// FILE: ChangePassword.jsx
// WHAT IT DOES: Allows logged in admin to change their password.
// Used by: App.jsx route "/admin/change-password"
// ============================================
import React, { useState } from 'react';
import { changePassword } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ChangePassword() {
    const { user } = useAuth();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        if (form.newPassword.length < 6) {
            return toast.error('New password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
            toast.success('Password changed successfully');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full p-2 border rounded-lg focus:ring-primary-500 text-sm";
    const labelClass = "block text-sm font-medium mb-1";

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Change Password</h1>
            <p className="text-sm text-gray-500">Currently logged in as: <strong className="text-gray-900">{user?.email}</strong></p>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
                <div>
                    <label className={labelClass}>Current Password</label>
                    <input required type="password" className={inputClass} value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
                </div>
                <div>
                    <label className={labelClass}>New Password</label>
                    <input required type="password" className={inputClass} value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                </div>
                <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input required type="password" className={inputClass} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 disabled:opacity-50">
                        {loading ? 'Processing...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
}
