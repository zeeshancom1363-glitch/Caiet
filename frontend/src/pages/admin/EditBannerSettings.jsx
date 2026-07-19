// ============================================
// FILE: EditBannerSettings.jsx
// WHAT IT DOES: Top Banner settings form.
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminBannerSettings, updateBannerSettings } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function EditBannerSettings() {
    const [form, setForm] = useState({ isVisible: false, text: '', linkUrl: '', linkText: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminBannerSettings().then(res => {
            if (res.data) setForm(res.data);
        }).finally(() => setLoading(false));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateBannerSettings({ ...form, isVisible: Boolean(form.isVisible) });
            toast.success('Saved');
        } catch { toast.error('Failed to save'); }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold">Top Announcement Banner</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 space-y-4 border-b">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                        <input type="checkbox" checked={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.checked })} className="w-5 h-5 rounded" />
                        <span className="font-bold text-gray-900">Show Banner on Public Site</span>
                    </label>
                    <div><label className="block text-sm mb-1">Announcement Text *</label><input required className="w-full p-2 border rounded" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="Admissions open for 2025" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm mb-1">Button Text</label><input className="w-full p-2 border rounded" value={form.linkText} onChange={e => setForm({ ...form, linkText: e.target.value })} placeholder="Apply Now" /></div>
                        <div><label className="block text-sm mb-1">Button URL</label><input className="w-full p-2 border rounded" value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} placeholder="/apply or https://..." /></div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" />Save Banner</button>
                </div>
            </form>
        </div>
    );
}
