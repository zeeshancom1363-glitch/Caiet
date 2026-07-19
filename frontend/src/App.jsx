// ============================================
// FILE: App.jsx
// WHAT IT DOES: The main routing file. It defines
// ALL routes for both the public website and the
// admin panel. Think of this as the "table of
// contents" for the whole app.
// ============================================
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// --- Layouts ---
import WebsiteLayout from './components/website/WebsiteLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import Loader from './components/website/Loader.jsx';

// ========== PUBLIC WEBSITE PAGES ==========
const Home = lazy(() => import('./pages/website/Home.jsx'));
const Courses = lazy(() => import('./pages/website/Courses.jsx'));
const CourseDetail = lazy(() => import('./pages/website/CourseDetail.jsx'));
const Admissions = lazy(() => import('./pages/website/Admissions.jsx'));
const ApplyNow = lazy(() => import('./pages/website/ApplyNow.jsx'));
const Services = lazy(() => import('./pages/website/Services.jsx'));
const ServiceDetail = lazy(() => import('./pages/website/ServiceDetail.jsx'));
const About = lazy(() => import('./pages/website/About.jsx'));
const Blogs = lazy(() => import('./pages/website/Blogs.jsx'));
const BlogDetail = lazy(() => import('./pages/website/BlogDetail.jsx'));
const Contact = lazy(() => import('./pages/website/Contact.jsx'));
const NotFound = lazy(() => import('./pages/website/NotFound.jsx'));

// ========== ADMIN PANEL PAGES ==========
const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));

// Courses group
const ManageCourseCategories = lazy(() => import('./pages/admin/ManageCourseCategories.jsx'));
const ManageCourses = lazy(() => import('./pages/admin/ManageCourses.jsx'));
const CourseForm = lazy(() => import('./pages/admin/CourseForm.jsx'));
const ManageInstructors = lazy(() => import('./pages/admin/ManageInstructors.jsx'));

// Admissions group
const ManageApplications = lazy(() => import('./pages/admin/ManageApplications.jsx'));
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents.jsx'));

// Services group
const ManageServiceCategories = lazy(() => import('./pages/admin/ManageServiceCategories.jsx'));
const ManageServices = lazy(() => import('./pages/admin/ManageServices.jsx'));
const ServiceForm = lazy(() => import('./pages/admin/ServiceForm.jsx'));
const ServicesPageSettings = lazy(() => import('./pages/admin/ServicesPageSettings.jsx'));

// Content group
const ManageBlogPosts = lazy(() => import('./pages/admin/ManageBlogPosts.jsx'));
const BlogPostForm = lazy(() => import('./pages/admin/BlogPostForm.jsx'));
const ManageFAQs = lazy(() => import('./pages/admin/ManageFAQs.jsx'));
const ManageTeamMembers = lazy(() => import('./pages/admin/ManageTeamMembers.jsx'));
const EditAboutSection = lazy(() => import('./pages/admin/EditAboutSection.jsx'));
const EditBannerSettings = lazy(() => import('./pages/admin/EditBannerSettings.jsx'));

// Inbox group
const ManageContactMessages = lazy(() => import('./pages/admin/ManageContactMessages.jsx'));
const ManageNewsletter = lazy(() => import('./pages/admin/ManageNewsletter.jsx'));

// Settings group
const EditSiteSettings = lazy(() => import('./pages/admin/EditSiteSettings.jsx'));
const ManageEmailTemplates = lazy(() => import('./pages/admin/ManageEmailTemplates.jsx'));
const ManageSiteConfigurations = lazy(() => import('./pages/admin/ManageSiteConfigurations.jsx'));
const ManageAdminUsers = lazy(() => import('./pages/admin/ManageAdminUsers.jsx'));
const ChangePassword = lazy(() => import('./pages/admin/ChangePassword.jsx'));

export default function App() {
    return (
        <AuthProvider>
            <Suspense fallback={<Loader />}>
                <Routes>

                    {/* ========== PUBLIC WEBSITE ROUTES ========== */}
                    <Route element={<WebsiteLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:slug" element={<CourseDetail />} />
                        <Route path="/admissions" element={<Admissions />} />
                        <Route path="/apply" element={<ApplyNow />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:slug" element={<ServiceDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/blogs/:slug" element={<BlogDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* ========== ADMIN ROUTES ========== */}
                    {/* Login is outside the protected layout */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* All other admin routes require authentication */}
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Courses */}
                        <Route path="course-categories" element={<ManageCourseCategories />} />
                        <Route path="courses" element={<ManageCourses />} />
                        <Route path="courses/new" element={<CourseForm />} />
                        <Route path="courses/edit/:id" element={<CourseForm />} />
                        <Route path="instructors" element={<ManageInstructors />} />

                        {/* Admissions */}
                        <Route path="applications" element={<ManageApplications />} />
                        <Route path="students" element={<ManageStudents />} />

                        {/* Services */}
                        <Route path="service-categories" element={<ManageServiceCategories />} />
                        <Route path="services" element={<ManageServices />} />
                        <Route path="services/new" element={<ServiceForm />} />
                        <Route path="services/edit/:id" element={<ServiceForm />} />
                        <Route path="services-page-settings" element={<ServicesPageSettings />} />

                        {/* Content */}
                        <Route path="blog-posts" element={<ManageBlogPosts />} />
                        <Route path="blog-posts/new" element={<BlogPostForm />} />
                        <Route path="blog-posts/edit/:id" element={<BlogPostForm />} />
                        <Route path="faqs" element={<ManageFAQs />} />
                        <Route path="team-members" element={<ManageTeamMembers />} />
                        <Route path="about-section" element={<EditAboutSection />} />
                        <Route path="banner-settings" element={<EditBannerSettings />} />

                        {/* Inbox */}
                        <Route path="contact-messages" element={<ManageContactMessages />} />
                        <Route path="newsletter" element={<ManageNewsletter />} />

                        {/* Settings */}
                        <Route path="site-settings" element={<EditSiteSettings />} />
                        <Route path="email-templates" element={<ManageEmailTemplates />} />
                        <Route path="site-configurations" element={<ManageSiteConfigurations />} />
                        <Route path="admin-users" element={<ManageAdminUsers />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>

                </Routes>
            </Suspense>
        </AuthProvider>
    );
}
