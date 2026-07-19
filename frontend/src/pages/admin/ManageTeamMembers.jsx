// ============================================
// FILE: ManageTeamMembers.jsx
// WHAT IT DOES: Admin CRUD for Team members.
// Used by: App.jsx route "/admin/team-members"
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { getAdminTeam, createTeamMember, updateTeamMember, deleteTeamMember, uploadImage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save, Upload } from 'lucide-react';

export default function ManageTeamMembers() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        fullName: '', designation: '', bio: '', department: '', facebookUrl: '', linkedinUrl: '', displayOrder: 0, photo: ''
    });

    useEffect(() => { loadTeam(); }, []);

    async function loadTeam() {
        try {
            const res = await getAdminTeam();
            setTeam(res.data);
        } catch { toast.error('Failed to load team'); }
        finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ ...item, displayOrder: item.displayOrder || 0 });
        } else {
            setEditingId(null);
            setForm({ fullName: '', designation: '', bio: '', department: '', facebookUrl: '', linkedinUrl: '', displayOrder: 0, photo: '' });
        }
        setIsModalOpen(true);
    }

    async function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData(); fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm(p => ({ ...p, photo: res.data.url }));
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) await updateTeamMember(editingId, { ...form, displayOrder: parseInt(form.displayOrder) });
            else await createTeamMember({ ...form, displayOrder: parseInt(form.displayOrder) });
            toast.success('Saved');
            setIsModalOpen(false);
            loadTeam();
        } catch { toast.error('Failed to save'); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this team member?')) {
            try {
                await deleteTeamMember(id);
                toast.success('Deleted');
                loadTeam();
            } catch { toast.error('Delete failed'); }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" /> Add Member</button>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm text-gray-600">
                            <tr><th className="p-4">Member</th><th className="p-4">Designation</th><th className="p-4">Department</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {team.map(m => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={m.photo || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                                        <span className="font-medium">{m.fullName}</span>
                                    </td>
                                    <td className="p-4">{m.designation}</td>
                                    <td className="p-4">{m.department || '-'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {team.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No team members.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{editingId ? 'Edit Member' : 'New Member'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="flex gap-4 items-center mb-4">
                                <img src={form.photo || 'https://via.placeholder.com/60'} className="w-16 h-16 rounded-full object-cover border" />
                                <div>
                                    <input type="file" ref={fileInputRef} onChange={handleImage} className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="px-3 py-1.5 bg-gray-100 rounded text-sm"><Upload className="w-4 h-4 inline mr-2" /> {uploading ? 'Uploading...' : 'Upload Photo'}</button>
                                </div>
                            </div>
                            <div><label className="block text-sm mb-1">Full Name *</label><input required className="w-full p-2 border rounded" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Designation</label><input className="w-full p-2 border rounded" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Department</label><input className="w-full p-2 border rounded" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Facebook URL</label><input className="w-full p-2 border rounded" value={form.facebookUrl} onChange={e => setForm({ ...form, facebookUrl: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">LinkedIn URL</label><input className="w-full p-2 border rounded" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Bio</label><textarea rows={3} className="w-full p-2 border rounded" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
                            <div><label className="block text-sm mb-1">Display Order (Lowest shows first)</label><input type="number" className="w-full p-2 border rounded" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: e.target.value })} /></div>
                            <div className="flex justify-end gap-2 pt-4"><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
