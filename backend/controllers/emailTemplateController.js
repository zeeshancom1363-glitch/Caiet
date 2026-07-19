// ============================================
// FILE: emailTemplateController.js
// WHAT IT DOES: CRUD for email templates.
// Used by: routes/emailTemplateRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getAllTemplates(req, res, next) {
    try {
        const templates = await prisma.emailTemplate.findMany();
        res.json(templates);
    } catch (error) { next(error); }
}

async function getTemplateById(req, res, next) {
    try {
        const tpl = await prisma.emailTemplate.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!tpl) return res.status(404).json({ error: 'Template not found.' });
        res.json(tpl);
    } catch (error) { next(error); }
}

async function createTemplate(req, res, next) {
    try {
        const d = req.body;
        const tpl = await prisma.emailTemplate.create({
            data: {
                templateName: d.templateName,
                subject: d.subject || '', bodyText: d.bodyText || '',
                templateType: d.templateType || 'welcome',
            },
        });
        await logActivity(req.admin.name, 'added', 'Email Template', d.templateName);
        res.status(201).json(tpl);
    } catch (error) { next(error); }
}

async function updateTemplate(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const d = req.body;
        const updateData = {};
        if (d.templateName !== undefined) updateData.templateName = d.templateName;
        if (d.subject !== undefined) updateData.subject = d.subject;
        if (d.bodyText !== undefined) updateData.bodyText = d.bodyText;
        if (d.templateType !== undefined) updateData.templateType = d.templateType;

        const tpl = await prisma.emailTemplate.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Email Template', tpl.templateName);
        res.json(tpl);
    } catch (error) { next(error); }
}

async function deleteTemplate(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const tpl = await prisma.emailTemplate.findUnique({ where: { id } });
        if (!tpl) return res.status(404).json({ error: 'Template not found.' });
        await prisma.emailTemplate.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Email Template', tpl.templateName);
        res.json({ message: 'Template deleted.' });
    } catch (error) { next(error); }
}

module.exports = { getAllTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate };
