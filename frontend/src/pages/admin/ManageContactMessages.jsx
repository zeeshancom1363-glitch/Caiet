// ============================================
// FILE: ManageContactMessages.jsx
// WHAT IT DOES: Admin inbox for contact messages
// Used by: App.jsx route "/admin/contact-messages"
// ============================================
import React, { useState, useEffect } from 'react';
import { getAdminContactMessages, deleteContactMessage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Trash2, Eye, X } from 'lucide-react';

export default function ManageContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewedMessage, setViewedMessage] = useState(null);

    useEffect(() => { loadMessages(); }, []);

    async function loadMessages() {
        try {
            const res = await getAdminContactMessages();
            setMessages(res.data);
        } catch { toast.error('Failed to load messages'); }
        finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete message?')) {
            try {
                await deleteContactMessage(id);
                toast.success('Deleted');
                setViewedMessage(null);
                loadMessages();
            } catch { toast.error('Delete failed'); }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Contact Messages</h1>
                <p className="text-gray-500 font-medium">{messages.length} Messages</p>
            </div>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-sm">
                            <tr><th className="p-4">Sender</th><th className="p-4">Subject</th><th className="p-4">Date</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {messages.map(m => (
                                <tr key={m.id} className={`hover:bg-gray-50 ${!m.isRead ? 'font-medium bg-blue-50/30' : 'text-gray-600'}`}>
                                    <td className="p-4">
                                        <p className="text-gray-900">{m.fullName}</p>
                                        <p className="text-xs text-gray-500">{m.email}</p>
                                    </td>
                                    <td className="p-4">{m.subject || '-'}</td>
                                    <td className="p-4 text-xs">{new Date(m.createdAt).toLocaleString()}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => setViewedMessage(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No messages.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {viewedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold">Message Details</h3>
                            <button onClick={() => setViewedMessage(null)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-5 space-y-4 text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div><strong className="block text-xs text-gray-500 uppercase">From</strong>{viewedMessage.fullName}</div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Email</strong><a href={`mailto:${viewedMessage.email}`} className="text-blue-600 hover:underline">{viewedMessage.email}</a></div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Phone</strong>{viewedMessage.phone || '-'}</div>
                                <div><strong className="block text-xs text-gray-500 uppercase">Subject</strong>{viewedMessage.subject || '-'}</div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <strong className="block text-xs text-gray-500 uppercase mb-1">Message</strong>
                                <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{viewedMessage.message}</div>
                            </div>
                            <div className="pt-4 border-t flex justify-end gap-2">
                                <button onClick={() => handleDelete(viewedMessage.id)} className="px-4 py-2 bg-red-600 text-white rounded font-medium text-sm flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
