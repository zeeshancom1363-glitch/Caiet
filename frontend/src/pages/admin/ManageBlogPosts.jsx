// ============================================
// FILE: ManageBlogPosts.jsx
// WHAT IT DOES: Admin listing page for blog posts.
// Used by: App.jsx route "/admin/blog-posts"
// ============================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBlogs, deleteBlog } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, CheckCircle, Eye } from 'lucide-react';

export default function ManageBlogPosts() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadBlogs(); }, []);

    async function loadBlogs() {
        try {
            const res = await getAdminBlogs();
            setBlogs(res.data);
        } catch {
            toast.error('Failed to load blog posts');
        } finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this post?')) {
            try {
                await deleteBlog(id);
                toast.success('Deleted');
                loadBlogs();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                <Link to="/admin/blog-posts/new" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Post
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? <div className="p-10 text-center">Loading...</div> : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Published At</th>
                                <th className="p-4">Views</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {blogs.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900 max-w-[250px] truncate">{post.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {post.isPublished ? <CheckCircle className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-gray-400" />}
                                            <span className="text-xs text-gray-500">{post.isPublished ? 'Published' : 'Draft'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">{post.category || '-'}</td>
                                    <td className="p-4 text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-500 flex items-center gap-1 mt-2"><Eye className="w-4 h-4" /> {post.views}</td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        <Link to={`/admin/blog-posts/edit/${post.id}`} className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {blogs.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No posts found.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
