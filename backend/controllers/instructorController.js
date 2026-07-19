// ============================================
// FILE: instructorController.js
// WHAT IT DOES: CRUD operations for instructors.
// Used by: routes/instructorRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getPublicInstructors(req, res, next) {
    try {
        const instructors = await prisma.instructor.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
        res.json(instructors);
    } catch (error) { next(error); }
}

async function getAllInstructors(req, res, next) {
    try {
        const instructors = await prisma.instructor.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json(instructors);
    } catch (error) { next(error); }
}

async function getInstructorById(req, res, next) {
    try {
        const inst = await prisma.instructor.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!inst) return res.status(404).json({ error: 'Instructor not found.' });
        res.json(inst);
    } catch (error) { next(error); }
}

async function createInstructor(req, res, next) {
    try {
        const d = req.body;
        const inst = await prisma.instructor.create({
            data: {
                fullName: d.fullName, designation: d.designation || 'Instructor',
                bio: d.bio || '', photo: d.photo || null,
                email: d.email || '', expertiseTags: d.expertiseTags || '',
                linkedinUrl: d.linkedinUrl || '',
                displayOrder: parseInt(d.displayOrder) || 0,
                isActive: d.isActive !== false && d.isActive !== 'false',
            },
        });
        await logActivity(req.admin.name, 'added', 'Instructor', d.fullName);
        res.status(201).json(inst);
    } catch (error) { next(error); }
}

async function updateInstructor(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const d = req.body;
        const updateData = {};
        if (d.fullName !== undefined) updateData.fullName = d.fullName;
        if (d.designation !== undefined) updateData.designation = d.designation;
        if (d.bio !== undefined) updateData.bio = d.bio;
        if (d.photo !== undefined) updateData.photo = d.photo;
        if (d.email !== undefined) updateData.email = d.email;
        if (d.expertiseTags !== undefined) updateData.expertiseTags = d.expertiseTags;
        if (d.linkedinUrl !== undefined) updateData.linkedinUrl = d.linkedinUrl;
        if (d.displayOrder !== undefined) updateData.displayOrder = parseInt(d.displayOrder);
        if (d.isActive !== undefined) updateData.isActive = d.isActive === true || d.isActive === 'true';

        const inst = await prisma.instructor.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Instructor', inst.fullName);
        res.json(inst);
    } catch (error) { next(error); }
}

async function deleteInstructor(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const inst = await prisma.instructor.findUnique({ where: { id } });
        if (!inst) return res.status(404).json({ error: 'Instructor not found.' });
        await prisma.instructor.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Instructor', inst.fullName);
        res.json({ message: 'Instructor deleted.' });
    } catch (error) { next(error); }
}

module.exports = {
    getPublicInstructors, getAllInstructors, getInstructorById,
    createInstructor, updateInstructor, deleteInstructor,
};
