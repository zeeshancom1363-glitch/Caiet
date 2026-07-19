// ============================================
// FILE: newsletterController.js
// WHAT IT DOES: Handles newsletter subscriptions
// and admin management including CSV export.
// Used by: routes/newsletterRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

// PUBLIC — subscribe to newsletter
async function subscribe(req, res, next) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required.' });

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (existing) {
            return res.json({ message: 'You are already subscribed!' });
        }

        await prisma.newsletterSubscriber.create({ data: { email } });
        res.status(201).json({ message: 'Subscribed successfully!' });
    } catch (error) { next(error); }
}

// ADMIN
async function getAllSubscribers(req, res, next) {
    try {
        const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
        res.json(subs);
    } catch (error) { next(error); }
}

async function deleteSubscriber(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const sub = await prisma.newsletterSubscriber.findUnique({ where: { id } });
        if (!sub) return res.status(404).json({ error: 'Subscriber not found.' });
        await prisma.newsletterSubscriber.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Newsletter Subscriber', sub.email);
        res.json({ message: 'Subscriber removed.' });
    } catch (error) { next(error); }
}

// ADMIN — export subscribers as CSV
async function exportCSV(req, res, next) {
    try {
        const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
        let csv = 'Email,Subscribed At,Active\n';
        subs.forEach(s => {
            csv += `${s.email},${s.subscribedAt.toISOString()},${s.isActive}\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
        res.send(csv);
    } catch (error) { next(error); }
}

module.exports = { subscribe, getAllSubscribers, deleteSubscriber, exportCSV };
