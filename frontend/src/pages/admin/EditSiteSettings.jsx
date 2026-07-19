// ============================================
// FILE: EditSiteSettings.jsx
// WHAT IT DOES: Admin singleton config for generic site details.
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { getAdminSiteSettings, updateSiteSettings, uploadImage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';

export default function EditSiteSettings() {
    const [form, setForm] = useState({
        siteName: '', shortDescription: '', contactEmail: '', phone: '',
        address: '', facebookUrl: '', twitterUrl: '', instagramUrl: '', linkedinUrl: '', mapEmbedUrl: '',
        logoImage: '', faviconImage: '', whatsappNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const logoRef = useRef(null);

    useEffect(() => {
        getAdminSiteSettings().then(res => {
            if (res.data) setForm(res.data);
        }).finally(() => setLoading(false));
    }, []);

    async function handleImage(field, e) {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData(); fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm({ ...form, [field]: res.data.url });
        } catch { toast.error('Upload failed'); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateSiteSettings(form);
            toast.success('Site settings saved');
        } catch { toast.error('Failed to save'); }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    const inputClass = "w-full p-2 border rounded-lg focus:ring-primary-500 text-sm";
    const labelClass = "block text-sm font-medium mb-1";

    return (
        <div className="max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold">Global Site Settings</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 space-y-6 border-b">
                    {/* Logo */}
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                            {form.logoImage ? <img src={form.logoImage} className="w-full h-full object-contain" /> : 'Logo'}
                        </div>
                        <div>
                            <label className={labelClass}>Site Logo</label>
                            <input type="file" ref={logoRef} onChange={e => handleImage('logoImage', e)} className="hidden" />
                            <button type="button" onClick={() => logoRef.current.click()} className="px-3 py-1.5 bg-gray-100 text-sm rounded"><Upload className="w-4 h-4 inline mr-1" /> Upload Logo</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className={labelClass}>Site Name</label><input className={inputClass} value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} /></div>
                        <div><label className={labelClass}>Contact Email</label><input className={inputClass} value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} /></div>
                        <div><label className={labelClass}>Phone Number</label><input className={inputClass} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        <div><label className={labelClass}>WhatsApp Number</label><input className={inputClass} value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="+92 300 0000000" /></div>
                        <div className="col-span-full"><label className={labelClass}>Address</label><input className={inputClass} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                        <div className="col-span-full"><label className={labelClass}>Footer Short Description</label><textarea className={inputClass} rows={2} value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} /></div>

                        {/* Social Links */}
                        <div className="col-span-full mt-4"><h3 className="font-bold border-b pb-2">Social Links</h3></div>
                        <div><label className={labelClass}>Facebook URL</label><input className={inputClass} value={form.facebookUrl} onChange={e => setForm({ ...form, facebookUrl: e.target.value })} /></div>
                        <div><label className={labelClass}>Twitter URL</label><input className={inputClass} value={form.twitterUrl} onChange={e => setForm({ ...form, twitterUrl: e.target.value })} /></div>
                        <div><label className={labelClass}>Instagram URL</label><input className={inputClass} value={form.instagramUrl} onChange={e => setForm({ ...form, instagramUrl: e.target.value })} /></div>
                        <div><label className={labelClass}>LinkedIn URL</label><input className={inputClass} value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} /></div>
                        <div className="col-span-full"><label className={labelClass}>Google Maps Embed Source URL</label><input className={inputClass} value={form.mapEmbedUrl} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." /></div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /> Save Settings</button>
                </div>
            </form>
        </div>
    );
}
