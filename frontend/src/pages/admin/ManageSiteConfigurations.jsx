// ============================================
// FILE: ManageSiteConfigurations.jsx
// WHAT IT DOES: Admin CRUD for developer config variables.
// Used by: App.jsx route "/admin/site-configurations"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminSiteConfigs, createSiteConfig, updateSiteConfig, deleteSiteConfig } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ManageSiteConfigurations() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ key: '', value: '', description: '' });

    useEffect(() => { loadConfigs(); }, []);

    async function loadConfigs() {
        try {
            const res = await getAdminSiteConfigs();
            setConfigs(res.data);
        } catch { toast.error('Failed to load configs'); }
        finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ key: item.key, value: item.value, description: item.description || '' });
        } else {
            setEditingId(null);
            setForm({ key: '', value: '', description: '' });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) await updateSiteConfig(editingId, form);
            else await createSiteConfig(form);
            toast.success('Saved');
            setIsModalOpen(false);
            loadConfigs();
        } catch { toast.error('Save failed'); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete config?')) {
            try {
                await deleteSiteConfig(id);
                toast.success('Deleted');
                loadConfigs();
            } catch { toast.error('Delete failed'); }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Site Configurations (Key-Value)</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" /> Add Config</button>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm">
                            <tr><th className="p-4">Key</th><th className="p-4">Value</th><th className="p-4">Description</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm text-gray-700">
                            {configs.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-xs font-bold">{c.key}</td>
                                    <td className="p-4"><div className="truncate max-w-xs">{c.value}</div></td>
                                    <td className="p-4 text-xs text-gray-500">{c.description || '-'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {configs.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No configs found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{editingId ? 'Edit Config' : 'New Config'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div><label className="block text-sm mb-1">Key *</label><input required className="w-full p-2 border rounded font-mono text-sm" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} disabled={!!editingId} /></div>
                            <div><label className="block text-sm mb-1">Value *</label><textarea required rows={4} className="w-full p-2 border rounded" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Description</label><input className="w-full p-2 border rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="flex justify-end pt-4"><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
