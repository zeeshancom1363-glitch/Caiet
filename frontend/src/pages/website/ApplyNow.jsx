// ============================================
// FILE: ApplyNow.jsx
// WHAT IT DOES: Application form page. Student fills
// in their details, selects a course, and submits.
// Data goes to POST /api/public/applications.
// Used by: App.jsx route "/apply"
// ============================================
import React, { useEffect, useState } from 'react';
import { getCourses, submitApplication } from '../../api/publicApi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Send, CheckCircle } from 'lucide-react';

export default function ApplyNow() {
    const [courses, setCourses] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', courseId: '',
        city: '', educationLevel: '', message: '',
    });

    useEffect(() => {
        getCourses().then(r => setCourses(r.data.filter(c => c.isActive))).catch(() => { });
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.phone || !form.courseId) {
            return toast.error('Please fill all required fields');
        }
        setLoading(true);
        try {
            await submitApplication({ ...form, courseId: parseInt(form.courseId) });
            setSubmitted(true);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Submission failed');
        } finally {
            setLoading(false);
        }
    }

    // Success state
    if (submitted) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-surface py-20">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-ink mb-3">Application Submitted!</h2>
                    <p className="text-body mb-2">Thank you for applying to CAI&ET.</p>
                    <p className="text-sm text-body">Our admissions team will review your application and contact you within 24-48 hours.</p>
                </motion.div>
            </section>
        );
    }

    const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition';

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-heading mb-4">
                        Apply Now
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-300">
                        Fill out the form below to start your journey at CAI&ET.
                    </motion.p>
                </div>
            </section>

            {/* Form */}
            <section className="py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="glass-card p-8 space-y-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1.5">Full Name *</label>
                                <input name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} placeholder="Muhammad Ali" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1.5">Email *</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1.5">Phone *</label>
                                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+92 300 1234567" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1.5">City</label>
                                <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="Lahore" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-ink mb-1.5">Select Course *</label>
                            <select name="courseId" value={form.courseId} onChange={handleChange} className={inputClass} required>
                                <option value="">-- Choose a course --</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-ink mb-1.5">Education Level</label>
                            <select name="educationLevel" value={form.educationLevel} onChange={handleChange} className={inputClass}>
                                <option value="">-- Select --</option>
                                <option value="Matric">Matric</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-ink mb-1.5">Additional Message</label>
                            <textarea name="message" value={form.message} onChange={handleChange} className={inputClass} rows={4} placeholder="Tell us about yourself or any questions you have..." />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3.5 bg-gradient-brand text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Application</>}
                        </button>
                    </motion.form>
                </div>
            </section>
        </>
    );
}
