// ============================================
// FILE: ServicesPageSettings.jsx
// WHAT IT DOES: Admin singleton config for Services Landing page
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminServicesPage, updateServicesPage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function ServicesPageSettings() {
    const [form, setForm] = useState({ pageHeading: '', pageSubheading: '', introText: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminServicesPage().then(res => {
            if (res.data) setForm({ pageHeading: res.data.pageHeading || '', pageSubheading: res.data.pageSubheading || '', introText: res.data.introText || '' });
        }).finally(() => setLoading(false));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateServicesPage(form);
            toast.success('Saved settings');
        } catch {
            toast.error('Failed to save');
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold">Services Page Configuration</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 space-y-4 border-b">
                    <div><label className="block text-sm mb-1">Page Hero Heading</label><input required className="w-full p-2 border rounded" value={form.pageHeading} onChange={e => setForm({ ...form, pageHeading: e.target.value })} placeholder="e.g. Our Services" /></div>
                    <div><label className="block text-sm mb-1">Page Hero Subheading</label><input className="w-full p-2 border rounded" value={form.pageSubheading} onChange={e => setForm({ ...form, pageSubheading: e.target.value })} /></div>
                    <div><label className="block text-sm mb-1">Intro/About Text (below hero)</label><textarea rows={4} className="w-full p-2 border rounded" value={form.introText} onChange={e => setForm({ ...form, introText: e.target.value })} /></div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" />Save Configuration</button>
                </div>
            </form>
        </div>
    );
}
