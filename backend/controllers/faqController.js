// ============================================
// FILE: faqController.js
// WHAT IT DOES: CRUD for FAQs, filtered by
// category (Admissions, Courses, General).
// Used by: routes/faqRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getPublicFAQs(req, res, next) {
    try {
        const { category } = req.query;
        const where = { isActive: true };
        if (category) where.category = category;
        const faqs = await prisma.fAQ.findMany({ where, orderBy: { displayOrder: 'asc' } });
        res.json(faqs);
    } catch (error) { next(error); }
}

async function getAllFAQs(req, res, next) {
    try {
        const faqs = await prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json(faqs);
    } catch (error) { next(error); }
}

async function createFAQ(req, res, next) {
    try {
        const d = req.body;
        const faq = await prisma.fAQ.create({
            data: {
                question: d.question, answer: d.answer,
                category: d.category || 'General',
                displayOrder: parseInt(d.displayOrder) || 0,
                isActive: d.isActive !== false && d.isActive !== 'false',
            },
        });
        await logActivity(req.admin.name, 'added', 'FAQ', d.question.substring(0, 50));
        res.status(201).json(faq);
    } catch (error) { next(error); }
}

async function updateFAQ(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const d = req.body;
        const updateData = {};
        if (d.question !== undefined) updateData.question = d.question;
        if (d.answer !== undefined) updateData.answer = d.answer;
        if (d.category !== undefined) updateData.category = d.category;
        if (d.displayOrder !== undefined) updateData.displayOrder = parseInt(d.displayOrder);
        if (d.isActive !== undefined) updateData.isActive = d.isActive === true || d.isActive === 'true';

        const faq = await prisma.fAQ.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'FAQ', faq.question.substring(0, 50));
        res.json(faq);
    } catch (error) { next(error); }
}

async function deleteFAQ(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const faq = await prisma.fAQ.findUnique({ where: { id } });
        if (!faq) return res.status(404).json({ error: 'FAQ not found.' });
        await prisma.fAQ.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'FAQ', faq.question.substring(0, 50));
        res.json({ message: 'FAQ deleted.' });
    } catch (error) { next(error); }
}

module.exports = { getPublicFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ };
