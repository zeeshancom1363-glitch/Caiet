// ============================================
// FILE: EditAboutSection.jsx
// WHAT IT DOES: Singleton config for Home/About page About Section.
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { getAdminAboutSection, updateAboutSection, uploadImage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';

export default function EditAboutSection() {
    const [form, setForm] = useState({ heading: '', description: '', missionText: '', visionText: '', image: '' });
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        getAdminAboutSection().then(res => {
            if (res.data) setForm(res.data);
        }).finally(() => setLoading(false));
    }, []);

    async function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData(); fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm({ ...form, image: res.data.url });
        } catch { toast.error('Upload failed'); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateAboutSection(form);
            toast.success('Saved');
        } catch { toast.error('Failed to save'); }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold">About Section Core Content</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 space-y-4 border-b">
                    <div className="flex gap-4 items-center">
                        <img src={form.image || 'https://via.placeholder.com/150'} className="w-32 h-32 object-cover rounded bg-gray-100" />
                        <div>
                            <input type="file" ref={fileInputRef} onChange={handleImage} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 border rounded"><Upload className="w-4 h-4 inline mr-2" /> Upload Photo</button>
                        </div>
                    </div>
                    <div><label className="block text-sm mb-1">Heading</label><input className="w-full p-2 border rounded" value={form.heading} onChange={e => setForm({ ...form, heading: e.target.value })} /></div>
                    <div><label className="block text-sm mb-1">Main Description</label><textarea rows={5} className="w-full p-2 border rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div><label className="block text-sm mb-1">Mission Text</label><textarea rows={3} className="w-full p-2 border rounded" value={form.missionText} onChange={e => setForm({ ...form, missionText: e.target.value })} /></div>
                    <div><label className="block text-sm mb-1">Vision Text</label><textarea rows={3} className="w-full p-2 border rounded" value={form.visionText} onChange={e => setForm({ ...form, visionText: e.target.value })} /></div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" />Save Setings</button>
                </div>
            </form>
        </div>
    );
}
