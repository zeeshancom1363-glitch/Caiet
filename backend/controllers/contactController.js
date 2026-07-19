// ============================================
// FILE: contactController.js
// WHAT IT DOES: Handles contact form submissions
// and admin management of messages.
// Used by: routes/contactRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

// PUBLIC — submit a contact message
async function submitContact(req, res, next) {
    try {
        const d = req.body;
        if (!d.fullName || !d.email || !d.message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }
        const msg = await prisma.contactMessage.create({
            data: {
                fullName: d.fullName, email: d.email,
                phone: d.phone || '', subject: d.subject || '',
                message: d.message,
            },
        });
        res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) { next(error); }
}

// ADMIN
async function getAllMessages(req, res, next) {
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { receivedAt: 'desc' } });
        res.json(messages);
    } catch (error) { next(error); }
}

async function getMessageById(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        // Mark as read when opened
        const msg = await prisma.contactMessage.update({
            where: { id },
            data: { isRead: true },
        });
        if (!msg) return res.status(404).json({ error: 'Message not found.' });
        res.json(msg);
    } catch (error) { next(error); }
}

async function deleteMessage(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const msg = await prisma.contactMessage.findUnique({ where: { id } });
        if (!msg) return res.status(404).json({ error: 'Message not found.' });
        await prisma.contactMessage.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Contact Message', msg.fullName);
        res.json({ message: 'Message deleted.' });
    } catch (error) { next(error); }
}

module.exports = { submitContact, getAllMessages, getMessageById, deleteMessage };
