// ============================================
// FILE: ManageFAQs.jsx
// WHAT IT DOES: Admin CRUD for FAQs.
// Used by: App.jsx route "/admin/faqs"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ManageFAQs() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ question: '', answer: '', category: 'General' });

    useEffect(() => { loadFaqs(); }, []);

    async function loadFaqs() {
        try {
            const res = await getAdminFAQs();
            setFaqs(res.data);
        } catch { toast.error('Failed to load FAQs'); }
        finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ question: item.question, answer: item.answer, category: item.category || 'General' });
        } else {
            setEditingId(null);
            setForm({ question: '', answer: '', category: 'General' });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) await updateFAQ(editingId, form);
            else await createFAQ(form);
            toast.success('Saved');
            setIsModalOpen(false);
            loadFaqs();
        } catch { toast.error('Failed to save'); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete FAQ?')) {
            try {
                await deleteFAQ(id);
                toast.success('Deleted');
                loadFaqs();
            } catch { toast.error('Failed to delete'); }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">FAQs</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" /> Add FAQ</button>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm">
                            <tr><th className="p-4 w-1/4">Question</th><th className="p-4 w-1/2">Answer</th><th className="p-4">Category</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {faqs.map(faq => (
                                <tr key={faq.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium align-top">{faq.question}</td>
                                    <td className="p-4 text-gray-600 align-top"><div className="line-clamp-2">{faq.answer}</div></td>
                                    <td className="p-4 align-top">{faq.category}</td>
                                    <td className="p-4 text-right space-x-2 align-top">
                                        <button onClick={() => handleOpenModal(faq)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(faq.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {faqs.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No FAQs found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5">
                        <h3 className="font-bold border-b pb-3 mb-4">{editingId ? 'Edit FAQ' : 'New FAQ'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm mb-1">Question *</label><input required className="w-full p-2 border rounded" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Answer *</label><textarea required rows={4} className="w-full p-2 border rounded" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Context Category</label>
                                <select className="w-full p-2 border rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    <option>General</option>
                                    <option>Admissions</option>
                                    <option>Courses</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
