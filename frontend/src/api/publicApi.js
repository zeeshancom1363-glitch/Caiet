// ============================================
// FILE: publicApi.js
// WHAT IT DOES: All API calls for the PUBLIC
// website — courses, blogs, services, settings, etc.
// Used by: public website pages
// ============================================
import api from './axios';

// ----- Site Settings -----
export const getSettings = () => api.get('/public/settings');
export const getBanner = () => api.get('/public/banner');
export const getAbout = () => api.get('/public/about');

// ----- Courses -----
export const getCourses = () => api.get('/public/courses');
export const getCourseBySlug = (slug) => api.get(`/public/courses/${slug}`);
export const getCourseCategories = () => api.get('/public/course-categories');

// ----- Services -----
export const getServices = () => api.get('/public/services');
export const getServiceBySlug = (slug) => api.get(`/public/services/${slug}`);
export const getServiceCategories = () => api.get('/public/service-categories');
export const getServicesPage = () => api.get('/public/services-page');

// ----- Blogs -----
export const getBlogs = () => api.get('/public/blogs');
export const getBlogBySlug = (slug) => api.get(`/public/blogs/${slug}`);

// ----- Other -----
export const getInstructors = () => api.get('/public/instructors');
export const getTeam = () => api.get('/public/team');
export const getFAQs = (category) => api.get(`/public/faqs${category ? `?category=${category}` : ''}`);

// ----- Form Submissions -----
export const submitApplication = (data) => api.post('/public/applications', data);
export const submitContact = (data) => api.post('/public/contact', data);
export const subscribeNewsletter = (email) => api.post('/public/newsletter', { email });
