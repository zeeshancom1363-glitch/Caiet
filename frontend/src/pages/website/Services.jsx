// ============================================
// FILE: Services.jsx
// WHAT IT DOES: Lists all services with category tabs.
// Used by: App.jsx route "/services"
// ============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getServicesPage, getServiceCategories } from '../../api/publicApi';
import SectionTitle from '../../components/website/SectionTitle';
import { motion } from 'framer-motion';
import { ArrowRight, Code } from 'lucide-react';

export default function Services() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [selectedCat, setSelectedCat] = useState('all');

    useEffect(() => {
        getServices().then(r => setServices(r.data)).catch(() => { });
        getServiceCategories().then(r => setCategories(r.data)).catch(() => { });
        getServicesPage().then(r => setPageData(r.data)).catch(() => { });
    }, []);

    const filtered = selectedCat === 'all' ? services : services.filter(s => s.categoryId === parseInt(selectedCat));

    return (
        <>
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-heading mb-4">
                        {pageData?.pageHeading || 'Our Services'}
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-300 max-w-2xl mx-auto">
                        {pageData?.pageSubheading || 'Technology solutions for businesses of all sizes.'}
                    </motion.p>
                </div>
            </section>

            {pageData?.introText && (
                <section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <p className="text-body text-lg">{pageData.introText}</p>
                    </div>
                </section>
            )}

            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        <button onClick={() => setSelectedCat('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCat === 'all' ? 'bg-gradient-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setSelectedCat(String(cat.id))} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCat === String(cat.id) ? 'bg-gradient-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat.name}</button>
                        ))}
                    </div>

                    {/* Service Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((service, i) => (
                            <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-brand flex items-center justify-center">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-heading font-bold text-ink text-lg mb-2">{service.title}</h3>
                                <p className="text-sm text-body mb-4">{service.shortDescription}</p>
                                {service.priceText && <p className="text-sm font-semibold text-primary-600 mb-4">{service.priceText}</p>}
                                <Link to={`/services/${service.slug}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
