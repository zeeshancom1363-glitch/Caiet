// ============================================
// FILE: BlogPostForm.jsx
// WHAT IT DOES: Admin form for creating/editing blogs.
// Used by: App.jsx routes "/admin/blog-posts/new" and edit
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminBlogById, createBlog, updateBlog, uploadImage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function BlogPostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [form, setForm] = useState({
        title: '', slug: '', excerpt: '', content: '', authorName: 'CAI&ET Team',
        category: '', tags: '', isPublished: true, publishedAt: new Date().toISOString().split('T')[0], image: ''
    });

    useEffect(() => {
        if (id) {
            getAdminBlogById(id).then(res => {
                const d = res.data;
                setForm({
                    ...d,
                    publishedAt: new Date(d.publishedAt).toISOString().split('T')[0]
                });
                setLoading(false);
            }).catch(() => toast.error('Failed to load'));
        } else {
            setLoading(false);
        }
    }, [id]);

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm(prev => ({ ...prev, image: res.data.url }));
        } catch {
            toast.error('Upload failed');
        } finally { setUploadingImage(false); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const payload = { ...form, publishedAt: new Date(form.publishedAt).toISOString() };
        try {
            if (id) {
                await updateBlog(id, payload);
                toast.success('Updated');
            } else {
                await createBlog(payload);
                toast.success('Created');
            }
            navigate('/admin/blog-posts');
        } catch {
            toast.error('Failed to save');
        } finally { setSaving(false); }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded border hover:bg-gray-50"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-2xl font-bold">{id ? 'Edit Post' : 'Add Post'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex items-start gap-6">
                        <div className="w-48 h-32 rounded-xl bg-gray-100 border-2 border-dashed flex items-center justify-center overflow-hidden">
                            {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <span className="text-sm text-gray-400">Cover Image</span>}
                        </div>
                        <div className="flex-1 space-y-3 pt-4">
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Upload
                                </button>
                                {form.image && <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2"><X className="w-4 h-4" /> Remove</button>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-full"><label className="block text-sm mb-1">Title *</label><input required className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Slug</label><input className="w-full p-2 border rounded" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Category</label><input className="w-full p-2 border rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Author Name</label><input className="w-full p-2 border rounded" value={form.authorName} onChange={e => setForm({ ...form, authorName: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Published Date</label><input type="date" className="w-full p-2 border rounded" value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1">Tags (comma separated)</label><input className="w-full p-2 border rounded" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="AI, News" /></div>
                        <div className="col-span-full"><label className="block text-sm mb-1">Excerpt *</label><textarea required rows={2} className="w-full p-2 border rounded" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
                        <div className="col-span-full"><label className="block text-sm mb-1">Content (Markdown / Text) *</label><textarea required rows={10} className="w-full p-2 border rounded" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
                        <div className="col-span-full">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-5 h-5 rounded" />
                                <span>Publish immediately</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded"><Save className="w-4 h-4 inline mr-2" /> Save Post</button>
                </div>
            </form>
        </div>
    );
}
