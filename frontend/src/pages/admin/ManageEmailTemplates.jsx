// ============================================
// FILE: ManageEmailTemplates.jsx
// WHAT IT DOES: Admin CRUD for developer Email Templates.
// Used by: App.jsx route "/admin/email-templates"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ManageEmailTemplates() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', subject: '', body: '', variables: '' });

    useEffect(() => { loadTemplates(); }, []);

    async function loadTemplates() {
        try {
            const res = await getAdminEmailTemplates();
            setTemplates(res.data);
        } catch { toast.error('Failed to load templates'); }
        finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ name: item.name, subject: item.subject, body: item.body, variables: item.variables || '' });
        } else {
            setEditingId(null);
            setForm({ name: '', subject: '', body: '', variables: '' });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) await updateEmailTemplate(editingId, form);
            else await createEmailTemplate(form);
            toast.success('Saved');
            setIsModalOpen(false);
            loadTemplates();
        } catch { toast.error('Save failed'); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete template?')) {
            try {
                await deleteEmailTemplate(id);
                toast.success('Deleted');
                loadTemplates();
            } catch { toast.error('Delete failed'); }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Email Templates</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" /> Add Template</button>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm">
                            <tr><th className="p-4">Name</th><th className="p-4">Subject</th><th className="p-4">Variables</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {templates.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{t.name}</td>
                                    <td className="p-4 text-gray-600">{t.subject}</td>
                                    <td className="p-4 text-xs font-mono text-blue-600">{t.variables}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {templates.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No templates found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl my-8">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{editingId ? 'Edit Template' : 'New Template'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div><label className="block text-sm mb-1">Internal Name (e.g. WELCOME_EMAIL) *</label><input required className="w-full p-2 border rounded font-mono text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Email Subject *</label><input required className="w-full p-2 border rounded" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Expected Variables (comma sep)</label><input className="w-full p-2 border rounded font-mono text-sm" value={form.variables} onChange={e => setForm({ ...form, variables: e.target.value })} placeholder="{{name}}, {{course_title}}" /></div>
                            <div>
                                <label className="block text-sm mb-1">Email HTML Body *</label>
                                <textarea required rows={10} className="w-full p-2 border rounded font-mono text-sm bg-gray-50 whitespace-pre" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4"><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" />Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
