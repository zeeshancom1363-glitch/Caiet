// ============================================
// FILE: Courses.jsx
// WHAT IT DOES: Course listing page with category
// filtering and search.
// Used by: App.jsx route "/courses"
// ============================================
import React, { useEffect, useState } from 'react';
import { getCourses, getCourseCategories } from '../../api/publicApi';
import CourseCard from '../../components/website/CourseCard';
import SectionTitle from '../../components/website/SectionTitle';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getCourses(), getCourseCategories()])
            .then(([cRes, catRes]) => {
                setCourses(cRes.data);
                setCategories(catRes.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Filter courses
    const filtered = courses.filter(c => {
        const matchesCat = selectedCat === 'all' || c.categoryId === parseInt(selectedCat);
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <>
            {/* Hero Banner */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold font-heading mb-4"
                    >
                        Our Courses
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-300 max-w-2xl mx-auto"
                    >
                        Industry-focused programs designed to launch and accelerate your career in technology.
                    </motion.p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <Filter className="w-4 h-4 text-body" />
                            <button
                                onClick={() => setSelectedCat('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCat === 'all'
                                        ? 'bg-gradient-brand text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCat(String(cat.id))}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCat === String(cat.id)
                                            ? 'bg-gradient-brand text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Course Grid */}
                    {loading ? (
                        <div className="text-center py-20 text-body">Loading courses...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-body">No courses found.</p>
                            <p className="text-sm text-body mt-2">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
