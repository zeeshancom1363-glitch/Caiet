// ============================================
// FILE: dashboardController.js
// WHAT IT DOES: Returns aggregate stats and
// recent activity for the admin dashboard.
// Used by: routes/dashboardRoutes.js
// ============================================
const prisma = require('../config/db');

// GET /api/admin/dashboard-stats
async function getDashboardStats(req, res, next) {
    try {
        const [
            totalCourses, totalStudents, pendingApplications,
            unreadMessages, newsletterSubs, publishedBlogs,
        ] = await Promise.all([
            prisma.course.count(),
            prisma.student.count(),
            prisma.application.count({ where: { status: 'Pending' } }),
            prisma.contactMessage.count({ where: { isRead: false } }),
            prisma.newsletterSubscriber.count(),
            prisma.blogPost.count({ where: { isPublished: true } }),
        ]);

        res.json({
            totalCourses,
            totalStudents,
            pendingApplications,
            unreadMessages,
            newsletterSubs,
            publishedBlogs,
        });
    } catch (error) { next(error); }
}

// GET /api/admin/activity-log
async function getActivityLog(req, res, next) {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(logs);
    } catch (error) { next(error); }
}

// GET /api/admin/recent-applications
async function getRecentApplications(req, res, next) {
    try {
        const apps = await prisma.application.findMany({
            include: { course: { select: { title: true } } },
            orderBy: { appliedAt: 'desc' },
            take: 5,
        });
        res.json(apps);
    } catch (error) { next(error); }
}

module.exports = { getDashboardStats, getActivityLog, getRecentApplications };
