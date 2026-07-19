// ============================================
// FILE: ManageServices.jsx
// WHAT IT DOES: Admin listing page for services.
// Links to ServiceForm for create/edit.
// Used by: App.jsx route "/admin/services"
// ============================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminServices, deleteService } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, CheckCircle } from 'lucide-react';

export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { loadServices(); }, []);

    async function loadServices() {
        try {
            const res = await getAdminServices();
            setServices(res.data);
        } catch {
            toast.error('Failed to load services');
        } finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this service?')) {
            try {
                await deleteService(id);
                toast.success('Deleted');
                loadServices();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    const filtered = services.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <Link to="/admin/services/new" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Service
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search services..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                </div>

                {loading ? <div className="p-10 text-center">Loading...</div> : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price Text</th>
                                <th className="p-4">Featured</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {filtered.map(service => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{service.title}</td>
                                    <td className="p-4 text-gray-500">{service.category?.name || '-'}</td>
                                    <td className="p-4">{service.priceText || '-'}</td>
                                    <td className="p-4">{service.isFeatured && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Featured</span>}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link to={`/admin/services/edit/${service.id}`} className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(service.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No services found.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
