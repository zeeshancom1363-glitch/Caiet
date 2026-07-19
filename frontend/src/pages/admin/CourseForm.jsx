// ============================================
// FILE: CourseForm.jsx
// WHAT IT DOES: Large form to create or edit a course.
// Handles image uploads natively.
// Used by: App.jsx routes "/admin/courses/new" and "/admin/courses/edit/:id"
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminCourseById, createCourse, updateCourse, getAdminCourseCategories, getAdminInstructors, uploadImage } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function CourseForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [form, setForm] = useState({
        title: '', slug: '', categoryId: '', instructorId: '',
        shortDescription: '', fullDescription: '', syllabus: '',
        price: 0, discountPrice: 0, durationText: '', level: 'Beginner', totalSeats: 0,
        startDate: '', isFeatured: false, isActive: true, image: ''
    });

    useEffect(() => {
        Promise.all([getAdminCourseCategories(), getAdminInstructors()]).then(([catRes, instRes]) => {
            setCategories(catRes.data);
            setInstructors(instRes.data);
            if (id) {
                getAdminCourseById(id).then(res => {
                    const d = res.data;
                    setForm({
                        title: d.title, slug: d.slug, categoryId: d.categoryId || '', instructorId: d.instructorId || '',
                        shortDescription: d.shortDescription || '', fullDescription: d.fullDescription || '', syllabus: d.syllabus || '',
                        price: d.price || 0, discountPrice: d.discountPrice || 0, durationText: d.durationText || '', level: d.level || 'Beginner',
                        totalSeats: d.totalSeats || 0, startDate: d.startDate || '', isFeatured: d.isFeatured, isActive: d.isActive, image: d.image || ''
                    });
                    setLoading(false);
                }).catch(() => toast.error('Failed to load course'));
            } else {
                setLoading(false);
            }
        });
    }, [id]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm(prev => ({ ...prev, image: res.data.url }));
            toast.success('Image uploaded');
        } catch {
            toast.error('Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            categoryId: form.categoryId ? parseInt(form.categoryId) : null,
            instructorId: form.instructorId ? parseInt(form.instructorId) : null,
            price: parseFloat(form.price),
            discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
            totalSeats: parseInt(form.totalSeats) || null,
        };

        try {
            if (id) {
                await updateCourse(id, payload);
                toast.success('Course updated');
            } else {
                await createCourse(payload);
                toast.success('Course created');
            }
            navigate('/admin/courses');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-gray-500">Loading form...</div>;

    const inputClass = 'w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                    <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Course' : 'Create New Course'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Basic Info */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 object-fit">
                        <div className="col-span-full">
                            <label className={labelClass}>Course Title *</label>
                            <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g. Advanced Artificial Intelligence" />
                        </div>
                        <div>
                            <label className={labelClass}>URL Slug (optional)</label>
                            <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="auto-generated if left blank" />
                        </div>
                        <div>
                            <label className={labelClass}>Category</label>
                            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass}>
                                <option value="">-- No Category --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col-span-full">
                            <label className={labelClass}>Short Details (1-2 sentences) *</label>
                            <textarea required rows={2} name="shortDescription" value={form.shortDescription} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Course Image</h2>
                    <div className="flex items-start gap-6">
                        <div className="w-48 h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            {form.image ? <img src={form.image} alt="Course" className="w-full h-full object-cover" /> : <span className="text-sm text-gray-400">No image</span>}
                        </div>
                        <div className="flex-1 space-y-3">
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50">
                                    <Upload className="w-4 h-4" /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                </button>
                                {form.image && (
                                    <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition flex items-center gap-2">
                                        <X className="w-4 h-4" /> Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Recommended size: 800x600px. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Details & Pricing */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Details & Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <div>
                            <label className={labelClass}>Price (Rs.) *</label>
                            <input required type="number" min="0" name="price" value={form.price} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Discount Price (Rs.)</label>
                            <input type="number" min="0" name="discountPrice" value={form.discountPrice} onChange={handleChange} className={inputClass} placeholder="Leave 0 if none" />
                        </div>
                        <div>
                            <label className={labelClass}>Instructor</label>
                            <select name="instructorId" value={form.instructorId} onChange={handleChange} className={inputClass}>
                                <option value="">-- TBA --</option>
                                {instructors.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Duration</label>
                            <input name="durationText" value={form.durationText} onChange={handleChange} className={inputClass} placeholder="e.g. 3 Months" />
                        </div>
                        <div>
                            <label className={labelClass}>Level</label>
                            <select name="level" value={form.level} onChange={handleChange} className={inputClass}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                                <option>All Levels</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Total Seats</label>
                            <input type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Start Date</label>
                            <input name="startDate" value={form.startDate} onChange={handleChange} className={inputClass} placeholder="e.g. Oct 15, 2025" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Full Description</label>
                            <textarea rows={6} name="fullDescription" value={form.fullDescription} onChange={handleChange} className={inputClass} placeholder="Detailed HTML/Text about the course..." />
                        </div>
                        <div>
                            <label className={labelClass}>Syllabus (One point per line)</label>
                            <textarea rows={6} name="syllabus" value={form.syllabus} onChange={handleChange} className={inputClass} placeholder="Module 1: Intro\nModule 2: Advanced..." />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="p-6 border-b border-gray-100 flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                        <span className="text-sm font-medium text-gray-700">Course is Active (Visible)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                        <span className="text-sm font-medium text-gray-700">Featured Course (Shows on Home)</span>
                    </label>
                </div>

                <div className="p-6 bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Course'}
                    </button>
                </div>
            </form>
        </div>
    );
}
