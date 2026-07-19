// ============================================
// FILE: Blogs.jsx
// WHAT IT DOES: Blog listing page with cards.
// Used by: App.jsx route "/blogs"
// ============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../api/publicApi';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowRight, Tag } from 'lucide-react';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogs().then(r => setBlogs(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <>
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-heading mb-4">Blog & Insights</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Stay updated with the latest in AI, technology, and education.
                    </motion.p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-20 text-body">Loading posts...</div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20 text-body text-lg">No blog posts yet. Check back soon!</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog, i) => (
                                <motion.div key={blog.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                    <Link to={`/blogs/${blog.slug}`} className="glass-card overflow-hidden group block h-full">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={blog.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600'}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-3 text-xs text-body mb-3">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views || 0} views</span>
                                                {blog.category && <span className="px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full flex items-center gap-1"><Tag className="w-3 h-3" />{blog.category}</span>}
                                            </div>
                                            <h3 className="font-heading font-bold text-ink text-lg mb-2 group-hover:text-primary-600 transition line-clamp-2">{blog.title}</h3>
                                            <p className="text-sm text-body line-clamp-3 mb-3">{blog.excerpt}</p>
                                            <span className="text-sm font-semibold text-primary-600 flex items-center gap-1">
                                                Read More <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
