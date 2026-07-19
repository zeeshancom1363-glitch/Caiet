// ============================================
// FILE: ManageApplications.jsx
// WHAT IT DOES: Admin listing of incoming student
// applications. Admin can approve or reject them.
// Used by: App.jsx route "/admin/applications"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminApplications, updateApplicationStatus, deleteApplication } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Check, X, Trash2, Eye } from 'lucide-react';

export default function ManageApplications() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => { loadApps(); }, []);

    async function loadApps() {
        try {
            const res = await getAdminApplications();
            setApps(res.data);
        } catch {
            toast.error('Failed to load apps');
        } finally { setLoading(false); }
    }

    async function handleStatusChange(id, status) {
        try {
            await updateApplicationStatus(id, { status });
            toast.success(`Application marked as ${status}`);
            loadApps();
            if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status }));
        } catch {
            toast.error('Update failed');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this application? This is irreversible.')) {
            try {
                await deleteApplication(id);
                toast.success('Deleted');
                if (selectedApp?.id === id) setSelectedApp(null);
                loadApps();
            } catch {
                toast.error('Delete failed');
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                <p className="text-sm text-gray-500 font-medium">{apps.length} Total</p>
            </div>

            {loading ? (
                <div className="p-10 text-center">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-200 text-sm">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Applicant</th>
                                <th className="p-4 font-semibold text-gray-600">Course</th>
                                <th className="p-4 font-semibold text-gray-600">Date/Time</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 text-right font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                            {apps.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900">{app.fullName}</p>
                                        <p className="text-xs text-gray-500">{app.email}</p>
                                    </td>
                                    <td className="p-4">{app.course?.title || <span className="text-gray-400">Course Deleted</span>}</td>
                                    <td className="p-4 text-gray-500">{new Date(app.createdAt).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => setSelectedApp(app)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                                        {app.status !== 'Approved' && <button onClick={() => handleStatusChange(app.id, 'Approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve"><Check className="w-4 h-4" /></button>}
                                        {app.status !== 'Rejected' && <button onClick={() => handleStatusChange(app.id, 'Rejected')} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Reject"><X className="w-4 h-4" /></button>}
                                        <button onClick={() => handleDelete(app.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {apps.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No applications found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal View */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white popup-card rounded-xl shadow-xl w-full max-w-lg my-8 overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-900">Application Details</h3>
                            <button onClick={() => setSelectedApp(null)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-5 space-y-4 text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div><strong className="block text-xs text-gray-500 uppercase">Name</strong>{selectedApp.fullName}</div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Email</strong><a href={`mailto:${selectedApp.email}`} className="text-primary-600 hover:underline">{selectedApp.email}</a></div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Phone</strong>{selectedApp.phone}</div>
                                <div><strong className="block text-xs text-gray-500 uppercase">City</strong>{selectedApp.city || '-'}</div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Education</strong>{selectedApp.educationLevel || '-'}</div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Course</strong>{selectedApp.course?.title || '-'}</div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <strong className="block text-xs text-gray-500 uppercase mb-1">Message from Student</strong>
                                <p className="bg-gray-50 p-3 items-center rounded text-gray-600 whitespace-pre-wrap">{selectedApp.message || 'No message provided.'}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => handleStatusChange(selectedApp.id, 'Approved')} className="px-4 py-2 bg-green-600 text-white rounded font-medium text-sm hover:bg-green-700">Approve</button>
                            <button onClick={() => handleStatusChange(selectedApp.id, 'Rejected')} className="px-4 py-2 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-700">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
