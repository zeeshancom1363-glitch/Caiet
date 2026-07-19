// ============================================
// FILE: Home.jsx
// WHAT IT DOES: The landing page — the first thing
// visitors see. Hero section with animated text,
// stats counter, featured courses, company values,
// CTA sections. All data is fetched from the API.
// Used by: App.jsx route "/"
// ============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourses, getAbout, getInstructors, getServices, getFAQs } from '../../api/publicApi';
import CourseCard from '../../components/website/CourseCard';
import SectionTitle from '../../components/website/SectionTitle';
import {
    GraduationCap, Brain, Users, Trophy, ArrowRight,
    Sparkles, BookOpen, Code, Cpu, Monitor, ChevronDown, ChevronUp
} from 'lucide-react';

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [about, setAbout] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [services, setServices] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        getCourses().then(r => setCourses(r.data.filter(c => c.isFeatured).slice(0, 4))).catch(() => { });
        getAbout().then(r => setAbout(r.data)).catch(() => { });
        getInstructors().then(r => setInstructors(r.data.slice(0, 4))).catch(() => { });
        getServices().then(r => setServices(r.data.filter(s => s.isFeatured).slice(0, 3))).catch(() => { });
        getFAQs().then(r => setFaqs(r.data.slice(0, 6))).catch(() => { });
    }, []);

    const stats = [
        { icon: GraduationCap, value: about?.studentsCount || '2500+', label: 'Students Trained' },
        { icon: BookOpen, value: about?.coursesCount || '25+', label: 'Courses Offered' },
        { icon: Users, value: about?.instructorsCount || '15+', label: 'Expert Instructors' },
        { icon: Trophy, value: about?.yearsExperience || '5+', label: 'Years Experience' },
    ];

    const features = [
        { icon: Brain, title: 'AI-Powered Learning', desc: 'Cutting-edge curriculum designed with industry AI standards' },
        { icon: Code, title: 'Hands-on Projects', desc: 'Build real-world projects for your professional portfolio' },
        { icon: Cpu, title: 'Industry Mentorship', desc: 'Learn from experienced tech professionals and researchers' },
        { icon: Monitor, title: 'Hybrid Learning', desc: 'Flexible online & on-campus classes to suit your schedule' },
    ];

    return (
        <>
            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
                {/* Background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500 rounded-full blur-[128px]" />
                </div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm mb-6">
                                <Sparkles className="w-4 h-4 text-accent" />
                                <span>Admissions Open for 2025 Batch</span>
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6 text-white"
                        >
                            Master The Future of{' '}
                            <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-accent bg-clip-text text-transparent">
                                AI & Technology
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl"
                        >
                            Join CAI&ET — the premier technology academy in Pakistan. Learn AI, Machine Learning,
                            Web Development, and more from industry experts with hands-on, project-based training.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link
                                to="/courses"
                                className="px-8 py-3.5 bg-gradient-brand text-white rounded-full font-semibold hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
                            >
                                Explore Courses <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/apply"
                                className="px-8 py-3.5 bg-white/10 backdrop-blur text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-200"
                            >
                                Apply Now
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="relative -mt-16 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card text-center p-6"
                            >
                                <stat.icon className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                                <p className="text-2xl md:text-3xl font-bold font-heading gradient-text">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-body mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHY CHOOSE US ===== */}
            <section className="py-20 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle
                        subtitle="Why CAI&ET"
                        title="Why Students Choose Us"
                        description="We combine world-class curriculum, expert mentorship, and hands-on learning to prepare you for a career in technology."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 text-center hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-brand flex items-center justify-center">
                                    <f.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-heading font-bold text-ink text-lg mb-2">{f.title}</h3>
                                <p className="text-sm text-body">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED COURSES ===== */}
            {courses.length > 0 && (
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Our Courses"
                            title="Featured Courses"
                            description="Explore our most popular courses designed to launch your career in technology."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-brand text-white rounded-full font-semibold hover:shadow-lg transition"
                            >
                                View All Courses <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== SERVICES SECTION ===== */}
            {services.length > 0 && (
                <section className="py-20 bg-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Our Services"
                            title="Technology Solutions for Your Business"
                            description="Beyond training, we deliver enterprise-grade technology solutions."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services.map((service, i) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-6 hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-brand flex items-center justify-center">
                                        <Code className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-heading font-bold text-ink text-lg mb-2">{service.title}</h3>
                                    <p className="text-sm text-body mb-4">{service.shortDescription}</p>
                                    <Link to={`/services/${service.slug}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== INSTRUCTORS ===== */}
            {instructors.length > 0 && (
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Expert Faculty"
                            title="Meet Our Instructors"
                            description="Learn from experienced professionals who are passionate about teaching."
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {instructors.map((inst, i) => (
                                <motion.div
                                    key={inst.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-6 text-center group"
                                >
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center overflow-hidden">
                                        {inst.photo ? (
                                            <img src={inst.photo} alt={inst.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold gradient-text">{inst.fullName.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="font-heading font-bold text-ink">{inst.fullName}</h3>
                                    <p className="text-sm text-primary-600 font-medium mb-2">{inst.designation}</p>
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {inst.expertiseTags?.split(',').slice(0, 3).map((tag, j) => (
                                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-body">{tag.trim()}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== FAQ SECTION ===== */}
            {faqs.length > 0 && (
                <section className="py-20 bg-surface">
                    <div className="max-w-3xl mx-auto px-4">
                        <SectionTitle
                            subtitle="FAQ"
                            title="Frequently Asked Questions"
                        />
                        <div className="space-y-3">
                            {faqs.map((faq, i) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className="font-medium text-ink pr-4">{faq.question}</span>
                                        {openFaq === faq.id ? (
                                            <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {openFaq === faq.id && (
                                        <div className="px-5 pb-5 text-sm text-body -mt-2">
                                            {faq.answer}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== CTA SECTION ===== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 text-white py-20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[100px]" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                            Ready to Start Your Tech Journey?
                        </h2>
                        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                            Join thousands of students who have transformed their careers through our industry-focused programs.
                            Admissions are open — secure your spot today!
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/apply"
                                className="px-8 py-3.5 bg-white text-primary-700 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                            >
                                Apply Now — It's Free
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/30 rounded-full font-semibold hover:bg-white/20 transition"
                            >
                                Talk to Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
