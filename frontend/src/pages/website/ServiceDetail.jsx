// ============================================
// FILE: ServiceDetail.jsx
// WHAT IT DOES: Single service detail page.
// Used by: App.jsx route "/services/:slug"
// ============================================
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug } from '../../api/publicApi';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, DollarSign } from 'lucide-react';

export default function ServiceDetail() {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getServiceBySlug(slug).then(r => setService(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-body">Loading...</div>;
    if (!service) return <div className="min-h-screen flex items-center justify-center text-body">Service not found</div>;

    return (
        <>
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <Link to="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 text-sm transition">
                        <ArrowLeft className="w-4 h-4" /> Back to Services
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading">{service.title}</h1>
                    </motion.div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center">
                                <Code className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-body">{service.category?.name}</p>
                                {service.priceText && (
                                    <p className="font-bold gradient-text flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" /> {service.priceText}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-body leading-relaxed whitespace-pre-line">{service.fullDescription}</p>
                        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-white rounded-xl font-bold hover:shadow-lg transition">
                            Contact Us About This Service
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
