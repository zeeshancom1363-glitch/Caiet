// ============================================
// FILE: Contact.jsx
// WHAT IT DOES: Contact page with form, info, and map.
// Used by: App.jsx route "/contact"
// ============================================
import React, { useEffect, useState } from 'react';
import { getSettings, submitContact } from '../../api/publicApi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });

    useEffect(() => {
        getSettings().then(r => setSettings(r.data)).catch(() => { });
    }, []);

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.message) return toast.error('Please fill required fields');
        setLoading(true);
        try {
            await submitContact(form);
            toast.success('Message sent successfully!');
            setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send');
        } finally {
            setLoading(false);
        }
    }

    const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition';

    return (
        <>
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-heading mb-4">Contact Us</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-300">
                        Have a question? We'd love to hear from you.
                    </motion.p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-bold font-heading text-ink mb-4">Get In Touch</h2>
                        {[
                            { icon: Phone, label: 'Phone', value: settings?.phone, href: `tel:${settings?.phone}` },
                            { icon: Mail, label: 'Email', value: settings?.email, href: `mailto:${settings?.email}` },
                            { icon: MapPin, label: 'Address', value: settings?.address },
                            { icon: Clock, label: 'Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM' },
                        ].map((item, i) => item.value && (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="glass-card p-4 flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-body mb-0.5">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="text-sm font-medium text-ink hover:text-primary-600 transition">{item.value}</a>
                                    ) : (
                                        <p className="text-sm font-medium text-ink">{item.value}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* WhatsApp Button */}
                        {settings?.whatsappNumber && (
                            <a
                                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card p-4 flex items-center gap-4 hover:shadow-md transition group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">WhatsApp</p>
                                    <p className="text-sm font-medium text-ink group-hover:text-green-600 transition">Chat with us</p>
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                            <h2 className="text-xl font-bold font-heading text-ink">Send a Message</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1.5">Full Name *</label>
                                    <input name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1.5">Email *</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1.5">Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1.5">Subject</label>
                                    <input name="subject" value={form.subject} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1.5">Message *</label>
                                <textarea name="message" value={form.message} onChange={handleChange} className={inputClass} rows={5} required />
                            </div>
                            <button type="submit" disabled={loading} className="px-8 py-3.5 bg-gradient-brand text-white rounded-xl font-bold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50">
                                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* Map */}
            {settings?.mapEmbedUrl && (
                <section className="py-0">
                    <iframe src={settings.mapEmbedUrl} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location Map" />
                </section>
            )}
        </>
    );
}
