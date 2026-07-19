// ============================================
// FILE: adminApi.js
// WHAT IT DOES: All API calls for the ADMIN
// panel — CRUD for every section + dashboard.
// Used by: admin pages
// ============================================
import api from './axios';

// ----- Auth -----
export const adminLogin = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.post('/auth/change-password', data);

// ----- Dashboard -----
export const getDashboardStats = () => api.get('/admin/dashboard-stats');
export const getActivityLog = () => api.get('/admin/activity-log');
export const getRecentApplications = () => api.get('/admin/recent-applications');

// ----- Courses -----
export const getAdminCourses = () => api.get('/admin/courses');
export const getAdminCourseById = (id) => api.get(`/admin/courses/${id}`);
export const createCourse = (data) => api.post('/admin/courses', data);
export const updateCourse = (id, data) => api.put(`/admin/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/admin/courses/${id}`);

// ----- Course Categories -----
export const getAdminCourseCategories = () => api.get('/admin/course-categories');
export const createCourseCategory = (data) => api.post('/admin/course-categories', data);
export const updateCourseCategory = (id, data) => api.put(`/admin/course-categories/${id}`, data);
export const deleteCourseCategory = (id) => api.delete(`/admin/course-categories/${id}`);

// ----- Instructors -----
export const getAdminInstructors = () => api.get('/admin/instructors');
export const getAdminInstructorById = (id) => api.get(`/admin/instructors/${id}`);
export const createInstructor = (data) => api.post('/admin/instructors', data);
export const updateInstructor = (id, data) => api.put(`/admin/instructors/${id}`, data);
export const deleteInstructor = (id) => api.delete(`/admin/instructors/${id}`);

// ----- Applications -----
export const getAdminApplications = () => api.get('/admin/applications');
export const getAdminApplicationById = (id) => api.get(`/admin/applications/${id}`);
export const updateApplicationStatus = (id, data) => api.put(`/admin/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/admin/applications/${id}`);

// ----- Students -----
export const getAdminStudents = () => api.get('/admin/students');
export const getAdminStudentById = (id) => api.get(`/admin/students/${id}`);
export const createStudent = (data) => api.post('/admin/students', data);
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);

// ----- Services -----
export const getAdminServices = () => api.get('/admin/services');
export const getAdminServiceById = (id) => api.get(`/admin/services/${id}`);
export const createService = (data) => api.post('/admin/services', data);
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data);
export const deleteService = (id) => api.delete(`/admin/services/${id}`);

// ----- Service Categories -----
export const getAdminServiceCategories = () => api.get('/admin/service-categories');
export const createServiceCategory = (data) => api.post('/admin/service-categories', data);
export const updateServiceCategory = (id, data) => api.put(`/admin/service-categories/${id}`, data);
export const deleteServiceCategory = (id) => api.delete(`/admin/service-categories/${id}`);

// ----- Services Page Settings -----
export const getAdminServicesPage = () => api.get('/admin/services-page');
export const updateServicesPage = (data) => api.put('/admin/services-page', data);

// ----- Blog Posts -----
export const getAdminBlogs = () => api.get('/admin/blogs');
export const getAdminBlogById = (id) => api.get(`/admin/blogs/${id}`);
export const createBlog = (data) => api.post('/admin/blogs', data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

// ----- FAQs -----
export const getAdminFAQs = () => api.get('/admin/faqs');
export const createFAQ = (data) => api.post('/admin/faqs', data);
export const updateFAQ = (id, data) => api.put(`/admin/faqs/${id}`, data);
export const deleteFAQ = (id) => api.delete(`/admin/faqs/${id}`);

// ----- Team Members -----
export const getAdminTeam = () => api.get('/admin/team');
export const getAdminTeamById = (id) => api.get(`/admin/team/${id}`);
export const createTeamMember = (data) => api.post('/admin/team', data);
export const updateTeamMember = (id, data) => api.put(`/admin/team/${id}`, data);
export const deleteTeamMember = (id) => api.delete(`/admin/team/${id}`);

// ----- Settings (singletons) -----
export const getAdminSiteSettings = () => api.get('/admin/site-settings');
export const updateSiteSettings = (data) => api.put('/admin/site-settings', data);
export const getAdminBannerSettings = () => api.get('/admin/banner-settings');
export const updateBannerSettings = (data) => api.put('/admin/banner-settings', data);
export const getAdminAboutSection = () => api.get('/admin/about-section');
export const updateAboutSection = (data) => api.put('/admin/about-section', data);

// ----- Contact Messages -----
export const getAdminContactMessages = () => api.get('/admin/contact-messages');
export const getAdminContactMessageById = (id) => api.get(`/admin/contact-messages/${id}`);
export const deleteContactMessage = (id) => api.delete(`/admin/contact-messages/${id}`);

// ----- Newsletter -----
export const getAdminNewsletter = () => api.get('/admin/newsletter');
export const deleteNewsletterSubscriber = (id) => api.delete(`/admin/newsletter/${id}`);
export const exportNewsletterCSV = () => api.get('/admin/newsletter/export', { responseType: 'blob' });

// ----- Email Templates -----
export const getAdminEmailTemplates = () => api.get('/admin/email-templates');
export const getAdminEmailTemplateById = (id) => api.get(`/admin/email-templates/${id}`);
export const createEmailTemplate = (data) => api.post('/admin/email-templates', data);
export const updateEmailTemplate = (id, data) => api.put(`/admin/email-templates/${id}`, data);
export const deleteEmailTemplate = (id) => api.delete(`/admin/email-templates/${id}`);

// ----- Site Configurations -----
export const getAdminSiteConfigs = () => api.get('/admin/site-configurations');
export const createSiteConfig = (data) => api.post('/admin/site-configurations', data);
export const updateSiteConfig = (id, data) => api.put(`/admin/site-configurations/${id}`, data);
export const deleteSiteConfig = (id) => api.delete(`/admin/site-configurations/${id}`);

// ----- Admin Users -----
export const getAdminUsers = () => api.get('/admin/admin-users');
export const createAdminUser = (data) => api.post('/admin/admin-users', data);
export const updateAdminUser = (id, data) => api.put(`/admin/admin-users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/admin/admin-users/${id}`);

// ----- Upload -----
export const uploadImage = (formData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
