// ============================================
// FILE: ManageStudents.jsx
// WHAT IT DOES: Admin CRUD for manual Students list.
// Used by: App.jsx route "/admin/students"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminStudents, createStudent, updateStudent, deleteStudent } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', enrolledCourse: '', status: 'Active' });

    useEffect(() => { loadStudents(); }, []);

    async function loadStudents() {
        try {
            const res = await getAdminStudents();
            setStudents(res.data);
        } catch {
            toast.error('Failed to load students');
        } finally { setLoading(false); }
    }

    function handleOpenModal(item = null) {
        if (item) {
            setEditingId(item.id);
            setForm({ fullName: item.fullName, email: item.email, phone: item.phone || '', enrolledCourse: item.enrolledCourse || '', status: item.status });
        } else {
            setEditingId(null);
            setForm({ fullName: '', email: '', phone: '', enrolledCourse: '', status: 'Active' });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await updateStudent(editingId, form);
                toast.success('Student updated');
            } else {
                await createStudent(form);
                toast.success('Student added');
            }
            setIsModalOpen(false);
            loadStudents();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this student record?')) {
            try {
                await deleteStudent(id);
                toast.success('Deleted');
                loadStudents();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Students Database</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Student
                </button>
            </div>

            {loading ? (
                <div className="p-10 text-center">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <tr>
                                <th className="p-4">Name / Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Enrolled Course</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900">{student.fullName}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                    </td>
                                    <td className="p-4">{student.phone || '-'}</td>
                                    <td className="p-4">{student.enrolledCourse || '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(student)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(student.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No students found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{editingId ? 'Edit Student' : 'Add Student'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div><label className="block text-sm mb-1">Full Name *</label><input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="block text-sm mb-1">Email *</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="block text-sm mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="block text-sm mb-1">Enrolled Course (Manual logging)</label><input value={form.enrolledCourse} onChange={e => setForm({ ...form, enrolledCourse: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="block text-sm mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full p-2 border rounded">
                                    <option>Active</option>
                                    <option>Alumni</option>
                                    <option>Suspended</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-4"><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" />Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
