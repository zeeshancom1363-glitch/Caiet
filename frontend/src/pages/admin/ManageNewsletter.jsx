// ============================================
// FILE: ManageNewsletter.jsx
// WHAT IT DOES: Admin newsletter emails listing
// and CSV exporter.
// Used by: App.jsx route "/admin/newsletter"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminNewsletter, deleteNewsletterSubscriber, exportNewsletterCSV } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Trash2, Download } from 'lucide-react';

export default function ManageNewsletter() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => { loadSubs(); }, []);

    async function loadSubs() {
        try {
            const res = await getAdminNewsletter();
            setSubs(res.data);
        } catch { toast.error('Failed to load subscribers'); }
        finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this subscriber?')) {
            try {
                await deleteNewsletterSubscriber(id);
                toast.success('Deleted');
                loadSubs();
            } catch { toast.error('Delete failed'); }
        }
    }

    async function handleExport() {
        setExporting(true);
        try {
            const res = await exportNewsletterCSV();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `newsletter-caiet-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            toast.success('Downloaded CSV');
        } catch { toast.error('Export failed'); }
        finally { setExporting(false); }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
                    <p className="text-gray-500 font-medium text-sm">{subs.length} Subscribers</p>
                </div>
                <button onClick={handleExport} disabled={subs.length === 0 || exporting} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
                    <Download className="w-4 h-4" /> {exporting ? 'Exporting...' : 'Export to CSV'}
                </button>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm">
                            <tr><th className="p-4">Email</th><th className="p-4">Subscribed At</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {subs.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{s.email}</td>
                                    <td className="p-4 text-gray-500">{new Date(s.subscribedAt).toLocaleString()}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {subs.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No subscribers.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
