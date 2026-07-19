// ============================================
// FILE: CourseDetail.jsx
// WHAT IT DOES: Course detail page showing full
// info, syllabus, instructor, pricing, and apply CTA.
// Used by: App.jsx route "/courses/:slug"
// ============================================
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug } from '../../api/publicApi';
import { motion } from 'framer-motion';
import { Clock, BarChart3, Users, User, Calendar, BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CourseDetail() {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCourseBySlug(slug)
            .then(r => setCourse(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-body">Loading...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center text-body">Course not found</div>;

    const hasDiscount = course.discountPrice && course.discountPrice < course.price;
    const syllabusItems = course.syllabus ? course.syllabus.split('\n').filter(Boolean) : [];

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <Link to="/courses" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 text-sm transition">
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {course.category && (
                            <span className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-4">
                                {course.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">{course.title}</h1>
                        <p className="text-lg text-gray-300 max-w-3xl">{course.shortDescription}</p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold font-heading text-ink mb-4">About This Course</h2>
                            <p className="text-body leading-relaxed whitespace-pre-line">{course.fullDescription}</p>
                        </div>

                        {/* Syllabus */}
                        {syllabusItems.length > 0 && (
                            <div className="glass-card p-6">
                                <h2 className="text-xl font-bold font-heading text-ink mb-4">📘 Course Syllabus</h2>
                                <div className="space-y-3">
                                    {syllabusItems.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                                            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-ink">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Instructor */}
                        {course.instructor && (
                            <div className="glass-card p-6">
                                <h2 className="text-xl font-bold font-heading text-ink mb-4">👨‍🏫 Instructor</h2>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl font-bold text-white">{course.instructor.fullName.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-ink">{course.instructor.fullName}</h3>
                                        <p className="text-sm text-primary-600">{course.instructor.designation}</p>
                                        <p className="text-sm text-body mt-2">{course.instructor.bio}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24 space-y-6">
                            {/* Image */}
                            <img
                                src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                                alt={course.title}
                                className="w-full h-48 object-cover rounded-xl"
                            />

                            {/* Price */}
                            <div className="text-center">
                                {hasDiscount ? (
                                    <>
                                        <p className="text-3xl font-bold gradient-text">Rs. {course.discountPrice?.toLocaleString()}</p>
                                        <p className="text-sm text-body line-through mt-1">Rs. {course.price?.toLocaleString()}</p>
                                        <span className="inline-block mt-1 px-3 py-0.5 bg-accent text-ink text-xs font-bold rounded-full">
                                            Save {Math.round(((course.price - course.discountPrice) / course.price) * 100)}%
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-3xl font-bold gradient-text">Rs. {course.price?.toLocaleString()}</p>
                                )}
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-primary-600" />
                                    <span className="text-body">Duration:</span>
                                    <span className="ml-auto font-medium text-ink">{course.durationText}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <BarChart3 className="w-4 h-4 text-primary-600" />
                                    <span className="text-body">Level:</span>
                                    <span className="ml-auto font-medium text-ink">{course.level}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Users className="w-4 h-4 text-primary-600" />
                                    <span className="text-body">Total Seats:</span>
                                    <span className="ml-auto font-medium text-ink">{course.totalSeats}</span>
                                </div>
                                {course.startDate && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-primary-600" />
                                        <span className="text-body">Starts:</span>
                                        <span className="ml-auto font-medium text-ink">{course.startDate}</span>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <Link
                                to="/apply"
                                className="block w-full text-center px-6 py-3.5 bg-gradient-brand text-white rounded-xl font-bold hover:shadow-lg transition"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
