// ============================================
// FILE: ServiceForm.jsx
// WHAT IT DOES: Admin form for creating/editing service
// Used by: App.jsx routes "/admin/services/new" and edit
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminServiceById, createService, updateService, getAdminServiceCategories } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function ServiceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '', slug: '', categoryId: '', shortDescription: '', fullDescription: '',
        priceText: '', isFeatured: false,
    });

    useEffect(() => {
        getAdminServiceCategories().then(res => setCategories(res.data));
        if (id) {
            getAdminServiceById(id).then(res => {
                const d = res.data;
                setForm({
                    title: d.title, slug: d.slug, categoryId: d.categoryId || '',
                    shortDescription: d.shortDescription || '', fullDescription: d.fullDescription || '',
                    priceText: d.priceText || '', isFeatured: d.isFeatured,
                });
                setLoading(false);
            }).catch(() => toast.error('Failed to load'));
        } else {
            setLoading(false);
        }
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const payload = { ...form, categoryId: form.categoryId ? parseInt(form.categoryId) : null };
        try {
            if (id) {
                await updateService(id, payload);
                toast.success('Updated');
            } else {
                await createService(payload);
                toast.success('Created');
            }
            navigate('/admin/services');
        } catch {
            toast.error('Failed to save');
        } finally { setSaving(false); }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded border hover:bg-gray-50"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-2xl font-bold">{id ? 'Edit Service' : 'Add Service'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 space-y-5 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-full"><label className="block text-sm mb-1">Service Title *</label><input required className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Slug</label><input className="w-full p-2 border rounded" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Category</label>
                            <select className="w-full p-2 border rounded" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                                <option value="">-- None --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm mb-1">Price Text (e.g. Starting from $50)</label><input className="w-full p-2 border rounded" value={form.priceText} onChange={e => setForm({ ...form, priceText: e.target.value })} /></div>
                        <div className="col-span-full"><label className="block text-sm mb-1">Short Description *</label><textarea required rows={2} className="w-full p-2 border rounded" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} /></div>
                        <div className="col-span-full"><label className="block text-sm mb-1">Full Description</label><textarea rows={6} className="w-full p-2 border rounded" value={form.fullDescription} onChange={e => setForm({ ...form, fullDescription: e.target.value })} /></div>
                        <div className="col-span-full">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-5 h-5" />
                                <span>Featured Service (Shows on Home)</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" /> {saving ? 'Saving...' : 'Save Service'}</button>
                </div>
            </form>
        </div>
    );
}
