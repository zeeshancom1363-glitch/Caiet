// ============================================
// FILE: applicationController.js
// WHAT IT DOES: Handles student applications.
// Public: submit application. Admin: list,
// view, change status, delete.
// Used by: routes/applicationRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

// PUBLIC — submit an application
async function submitApplication(req, res, next) {
    try {
        const d = req.body;
        if (!d.fullName || !d.email || !d.phone || !d.courseId) {
            return res.status(400).json({ error: 'Full name, email, phone, and course are required.' });
        }
        const app = await prisma.application.create({
            data: {
                fullName: d.fullName, email: d.email, phone: d.phone,
                courseId: parseInt(d.courseId),
                city: d.city || '', educationLevel: d.educationLevel || '',
                message: d.message || '',
            },
        });
        res.status(201).json({ message: 'Application submitted successfully! We will contact you soon.', application: app });
    } catch (error) { next(error); }
}

// ADMIN
async function getAllApplications(req, res, next) {
    try {
        const apps = await prisma.application.findMany({
            include: { course: { select: { title: true } } },
            orderBy: { appliedAt: 'desc' },
        });
        res.json(apps);
    } catch (error) { next(error); }
}

async function getApplicationById(req, res, next) {
    try {
        const app = await prisma.application.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { course: true },
        });
        if (!app) return res.status(404).json({ error: 'Application not found.' });
        res.json(app);
    } catch (error) { next(error); }
}

async function updateApplicationStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Status must be Pending, Approved, or Rejected.' });
        }
        const app = await prisma.application.update({ where: { id }, data: { status } });
        await logActivity(req.admin.name, 'changed', 'Application', `${app.fullName} → ${status}`);
        res.json(app);
    } catch (error) { next(error); }
}

async function deleteApplication(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const app = await prisma.application.findUnique({ where: { id } });
        if (!app) return res.status(404).json({ error: 'Application not found.' });
        await prisma.application.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Application', app.fullName);
        res.json({ message: 'Application deleted.' });
    } catch (error) { next(error); }
}

module.exports = {
    submitApplication, getAllApplications, getApplicationById,
    updateApplicationStatus, deleteApplication,
};
