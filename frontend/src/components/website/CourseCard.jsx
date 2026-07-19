// ============================================
// FILE: CourseCard.jsx
// WHAT IT DOES: A card component for displaying
// a course in the grid. Shows image, category,
// level, title, duration, price with discount.
// Used by: Courses page, Home page
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BarChart3, Users } from 'lucide-react';

export default function CourseCard({ course }) {
    const hasDiscount = course.discountPrice && course.discountPrice < course.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -6 }}
            className="glass-card overflow-hidden group"
        >
            {/* Course Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category badge */}
                {course.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-full text-primary-600">
                        {course.category.name}
                    </span>
                )}
                {/* Discount badge */}
                {hasDiscount && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-accent text-ink text-xs font-bold rounded-full">
                        {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
                    </span>
                )}
            </div>

            {/* Card Content */}
            <div className="p-5">
                {/* Level badge */}
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                    }`}>
                    {course.level}
                </span>

                <h3 className="font-heading font-bold text-ink text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                    {course.title}
                </h3>

                <p className="text-sm text-body line-clamp-2 mb-4">
                    {course.shortDescription}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-body mb-4">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.durationText}
                    </span>
                    <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {course.level}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {course.totalSeats} seats
                    </span>
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        {hasDiscount ? (
                            <>
                                <span className="text-lg font-bold gradient-text">
                                    Rs. {course.discountPrice?.toLocaleString()}
                                </span>
                                <span className="text-sm text-body line-through ml-2">
                                    Rs. {course.price?.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold gradient-text">
                                Rs. {course.price?.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <Link
                        to={`/courses/${course.slug}`}
                        className="px-4 py-2 bg-gradient-brand text-white text-xs font-semibold rounded-full hover:shadow-lg transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
