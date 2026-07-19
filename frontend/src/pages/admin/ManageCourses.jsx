// ============================================
// FILE: ManageCourses.jsx
// WHAT IT DOES: Admin listing page for courses.
// Links to CourseForm for create/edit.
// Used by: App.jsx route "/admin/courses"
// ============================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminCourses, deleteCourse } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

export default function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { loadCourses(); }, []);

    async function loadCourses() {
        try {
            const res = await getAdminCourses();
            setCourses(res.data);
        } catch {
            toast.error('Failed to load courses');
        } finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(id);
                toast.success('Course deleted');
                loadCourses();
            } catch {
                toast.error('Failed to delete');
            }
        }
    }

    const filtered = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="text-sm text-gray-500">Manage all academy courses.</p>
                </div>
                <Link to="/admin/courses/new" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Course
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                    <th className="p-4">Course</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map(course => (
                                    <tr key={course.id} className="hover:bg-gray-50 text-sm text-gray-700">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={course.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{course.title}</p>
                                                    <p className="text-xs text-gray-500">{course.durationText}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{course.category?.name || '-'}</td>
                                        <td className="p-4">
                                            Rs. {course.discountPrice || course.price}
                                            {course.discountPrice && <span className="block text-xs line-through text-gray-400">Rs. {course.price}</span>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                {course.isActive ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                                                <span className={course.isActive ? 'text-green-700' : 'text-gray-500'}>{course.isActive ? 'Active' : 'Draft'}</span>
                                            </div>
                                            {course.isFeatured && <span className="mt-1 inline-block px-2 text-[10px] bg-amber-100 text-amber-700 rounded-full font-medium">Featured</span>}
                                        </td>
                                        <td className="p-4 flex items-center justify-end gap-2">
                                            <Link to={`/admin/courses/edit/${course.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(course.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No courses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
