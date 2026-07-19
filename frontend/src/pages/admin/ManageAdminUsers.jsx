// ============================================
// FILE: ManageAdminUsers.jsx
// WHAT IT DOES: Admin CRUD for Admin Users (Superadmin only)
// Used by: App.jsx route "/admin/admin-users"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ManageAdminUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ email: '', role: 'Admin', password: '' });

    useEffect(() => { loadUsers(); }, []);

    async function loadUsers() {
        try {
            const res = await getAdminUsers();
            setUsers(res.data);
        } catch (err) {
            if (err.response?.status === 403) toast.error('Superadmin role required to view users.');
            else toast.error('Failed to load users');
        } finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ email: item.email, role: item.role, password: '' });
        } else {
            setEditingId(null);
            setForm({ email: '', role: 'Admin', password: '' });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                const payload = { ...form };
                if (!payload.password) delete payload.password; // Don't send empty password
                await updateAdminUser(editingId, payload);
            } else {
                await createAdminUser(form);
            }
            toast.success('Saved');
            setIsModalOpen(false);
            loadUsers();
        } catch (err) { toast.error(err.response?.data?.error || 'Save failed'); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this admin user?')) {
            try {
                await deleteAdminUser(id);
                toast.success('Deleted');
                loadUsers();
            } catch (err) { toast.error(err.response?.data?.error || 'Delete failed'); }
        }
    }

    if (user?.role !== 'Superadmin') {
        return <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">You do not have permission to view this page. Superadmin rights required.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Users System</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" /> Add Admin</button>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm">
                            <tr><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === 'Superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        {u.id !== user?.userId && <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{editingId ? 'Edit Admin' : 'New Admin'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div><label className="block text-sm mb-1">Email *</label><input required type="email" className="w-full p-2 border rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Role</label>
                                <select className="w-full p-2 border rounded" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option>Admin</option>
                                    <option>Superadmin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Password {editingId ? '(Leave blank to keep unchanged)' : '*'}</label>
                                <input type="password" required={!editingId} className="w-full p-2 border rounded" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="flex justify-end pt-4"><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
