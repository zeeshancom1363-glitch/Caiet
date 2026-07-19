// ============================================
// FILE: ManageCourseCategories.jsx
// WHAT IT DOES: Admin CRUD for course categories.
// Used by: App.jsx route "/admin/course-categories"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminCourseCategories, createCourseCategory, updateCourseCategory, deleteCourseCategory } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ManageCourseCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '' });

    useEffect(() => { loadCategories(); }, []);

    async function loadCategories() {
        try {
            const res = await getAdminCourseCategories();
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
                await updateCourseCategory(editingId, form);
                toast.success('Category updated');
            } else {
                await createCourseCategory(form);
                toast.success('Category created');
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this category? Courses belonging to it might be affected.')) {
            try {
                await deleteCourseCategory(id);
                toast.success('Category deleted');
                loadCategories();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Categories</h1>
                    <p className="text-sm text-gray-500">Manage categories for your courses.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="p-10 text-center text-gray-500">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Slug</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50 text-sm text-gray-700">
                                        <td className="p-4 font-medium">{cat.name}</td>
                                        <td className="p-4 text-gray-500">{cat.slug}</td>
                                        <td className="p-4 truncate max-w-xs">{cat.description || '-'}</td>
                                        <td className="p-4 flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No categories found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">{editingId ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional, auto-generated if empty)</label>
                                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition">
                                    <Save className="w-4 h-4" /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
