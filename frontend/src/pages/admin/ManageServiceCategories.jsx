// ============================================
// FILE: ManageServiceCategories.jsx
// WHAT IT DOES: Admin CRUD for service categories.
// Used by: App.jsx route "/admin/service-categories"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminServiceCategories, createServiceCategory, updateServiceCategory, deleteServiceCategory } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ManageServiceCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '' });

    useEffect(() => { loadCategories(); }, []);

    async function loadCategories() {
        try {
            const res = await getAdminServiceCategories();
            setCategories(res.data);
        } catch {
            toast.error('Failed to load categories');
        } finally { setLoading(false); }
    }

    function handleOpenModal(cat = null) {
        if (cat) {
            setEditingId(cat.id);
            setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
        } else {
            setEditingId(null);
            setForm({ name: '', slug: '', description: '' });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await updateServiceCategory(editingId, form);
            } else {
                await createServiceCategory(form);
            }
            toast.success('Category saved');
            setIsModalOpen(false);
            loadCategories();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete category? Services using this might be affected.')) {
            try {
                await deleteServiceCategory(id);
                toast.success('Deleted');
                loadCategories();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>
            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <tr>
                                <th className="p-4">Name</th><th className="p-4">Slug</th><th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{cat.name}</td>
                                    <td className="p-4 text-gray-500">{cat.slug}</td>
                                    <td className="p-4 space-x-2">
                                        <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No categories found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">
                        <h3 className="font-bold border-b pb-3 mb-4">{editingId ? 'Edit Category' : 'New Category'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm mb-1">Name *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="block text-sm mb-1">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="block text-sm mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
