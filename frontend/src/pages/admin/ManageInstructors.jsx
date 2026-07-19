// ============================================
// FILE: ManageInstructors.jsx
// WHAT IT DOES: Admin CRUD for Instructors.
// Used by: App.jsx route "/admin/instructors"
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { getAdminInstructors, createInstructor, updateInstructor, deleteInstructor, uploadImage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save, Upload } from 'lucide-react';

export default function ManageInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        fullName: '', designation: '', bio: '', expertiseTags: '', photo: ''
    });

    useEffect(() => { loadInstructors(); }, []);

    async function loadInstructors() {
        try {
            const res = await getAdminInstructors();
            setInstructors(res.data);
        } catch {
            toast.error('Failed to load instructors');
        } finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ fullName: item.fullName, designation: item.designation || '', bio: item.bio || '', expertiseTags: item.expertiseTags || '', photo: item.photo || '' });
        } else {
            setEditingId(null);
            setForm({ fullName: '', designation: '', bio: '', expertiseTags: '', photo: '' });
        }
        setIsModalOpen(true);
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm(prev => ({ ...prev, photo: res.data.url }));
        } catch {
            toast.error('Upload failed');
        } finally { setUploading(false); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await updateInstructor(editingId, form);
                toast.success('Instructor updated');
            } else {
                await createInstructor(form);
                toast.success('Instructor created');
            }
            setIsModalOpen(false);
            loadInstructors();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this instructor?')) {
            try {
                await deleteInstructor(id);
                toast.success('Deleted');
                loadInstructors();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Instructors</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Instructor
                </button>
            </div>

            {loading ? (
                <div className="p-10 text-center">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                                <th className="p-4">Instructor</th>
                                <th className="p-4">Designation</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {instructors.map(inst => (
                                <tr key={inst.id} className="hover:bg-gray-50 text-sm">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={inst.photo || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                                        <span className="font-medium">{inst.fullName}</span>
                                    </td>
                                    <td className="p-4">{inst.designation}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(inst)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(inst.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {instructors.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No instructors.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{editingId ? 'Edit Instructor' : 'Add Instructor'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <img src={form.photo || 'https://via.placeholder.com/60'} className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                                <div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                    <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded flex gap-2">
                                        <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name *</label>
                                <input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Designation</label>
                                <input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biography</label>
                                <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Expertise Tags (comma separated)</label>
                                <input value={form.expertiseTags} onChange={e => setForm({ ...form, expertiseTags: e.target.value })} className="w-full p-2 border rounded-lg placeholder-gray-400" placeholder="AI, Python, Data Science" />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg"><Save className="w-4 h-4 inline mr-2" /> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
