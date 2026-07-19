// ============================================
// FILE: BlogDetail.jsx
// WHAT IT DOES: Single blog post page.
// Used by: App.jsx route "/blogs/:slug"
// ============================================
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug } from '../../api/publicApi';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, User, Tag } from 'lucide-react';

export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogBySlug(slug).then(r => setBlog(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-body">Loading...</div>;
    if (!blog) return <div className="min-h-screen flex items-center justify-center text-body">Post not found</div>;

    return (
        <>
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 text-sm transition"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(blog.publishedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><User className="w-4 h-4" />{blog.authorName}</span>
                            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views} views</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold font-heading">{blog.title}</h1>
                    </motion.div>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {blog.image && (
                        <img src={blog.image} alt={blog.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />
                    )}
                    <article className="glass-card p-8 prose prose-lg max-w-none">
                        <div className="whitespace-pre-line text-body leading-relaxed">
                            {blog.content}
                        </div>
                    </article>
                    {blog.tags && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {blog.tags.split(',').map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-sm text-body rounded-full flex items-center gap-1">
                                    <Tag className="w-3 h-3" />{tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
