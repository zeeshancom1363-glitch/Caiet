// ============================================
// FILE: Admissions.jsx
// WHAT IT DOES: Admissions info page explaining
// the application process, requirements, and why
// to join. Links to the Apply Now page.
// Used by: App.jsx route "/admissions"
// ============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourses, getFAQs } from '../../api/publicApi';
import SectionTitle from '../../components/website/SectionTitle';
import { FileText, CheckCircle, ArrowRight, GraduationCap, ChevronDown, ChevronUp, ClipboardList, UserCheck, CreditCard, BookOpen } from 'lucide-react';

export default function Admissions() {
    const [courses, setCourses] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        getCourses().then(r => setCourses(r.data.filter(c => c.isActive))).catch(() => { });
        getFAQs('Admissions').then(r => setFaqs(r.data)).catch(() => { });
    }, []);

    const steps = [
        { icon: ClipboardList, title: 'Submit Application', desc: 'Fill out the online application form with your details and preferred course.' },
        { icon: UserCheck, title: 'Admission Review', desc: 'Our team reviews your application within 24-48 hours.' },
        { icon: CreditCard, title: 'Fee Payment', desc: 'Complete your enrollment by paying the course fee.' },
        { icon: BookOpen, title: 'Start Learning', desc: 'Access your course materials and begin your journey!' },
    ];

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-heading mb-4">
                        Admissions
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Your journey to mastering technology starts with a simple application. Join thousands of students who have launched their careers at CAI&ET.
                    </motion.p>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <SectionTitle subtitle="How It Works" title="Admission Process" description="Getting started is easy — just follow these 4 simple steps." />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 text-center relative"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-brand flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </span>
                                <h3 className="font-heading font-bold text-ink mb-2">{step.title}</h3>
                                <p className="text-sm text-body">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Available Courses */}
            <section className="py-16 bg-surface">
                <div className="max-w-5xl mx-auto px-4">
                    <SectionTitle subtitle="Available Programs" title="Courses Open for Enrollment" />
                    <div className="space-y-3">
                        {courses.slice(0, 8).map(course => (
                            <Link key={course.id} to={`/courses/${course.slug}`} className="glass-card p-4 flex items-center justify-between gap-4 hover:shadow-md transition group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-ink group-hover:text-primary-600 transition">{course.title}</h3>
                                        <p className="text-xs text-body">{course.durationText} · {course.level}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold gradient-text text-sm">
                                        Rs. {(course.discountPrice || course.price)?.toLocaleString()}
                                    </p>
                                    <ArrowRight className="w-4 h-4 text-primary-600 ml-auto mt-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            {faqs.length > 0 && (
                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-4">
                        <SectionTitle subtitle="FAQ" title="Admission FAQs" />
                        <div className="space-y-3">
                            {faqs.map(faq => (
                                <div key={faq.id} className="glass-card overflow-hidden">
                                    <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-5 text-left">
                                        <span className="font-medium text-ink pr-4">{faq.question}</span>
                                        {openFaq === faq.id ? <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                                    </button>
                                    {openFaq === faq.id && <div className="px-5 pb-5 text-sm text-body -mt-2">{faq.answer}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-gradient-to-r from-primary-600 to-violet-600 text-white py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold font-heading mb-4">Ready to Apply?</h2>
                    <p className="text-white/80 mb-6">It takes just 2 minutes. No application fee required.</p>
                    <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 rounded-full font-bold hover:shadow-xl transition">
                        Apply Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </>
    );
}
