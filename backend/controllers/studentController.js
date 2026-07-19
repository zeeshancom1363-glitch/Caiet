// ============================================
// FILE: studentController.js
// WHAT IT DOES: CRUD for enrolled students.
// Used by: routes/studentRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getAllStudents(req, res, next) {
    try {
        const students = await prisma.student.findMany({
            include: { enrolledCourse: { select: { title: true } } },
            orderBy: { enrollmentDate: 'desc' },
        });
        res.json(students);
    } catch (error) { next(error); }
}

async function getStudentById(req, res, next) {
    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { enrolledCourse: true },
        });
        if (!student) return res.status(404).json({ error: 'Student not found.' });
        res.json(student);
    } catch (error) { next(error); }
}

async function createStudent(req, res, next) {
    try {
        const d = req.body;
        const student = await prisma.student.create({
            data: {
                fullName: d.fullName, email: d.email,
                phone: d.phone || '', photo: d.photo || null,
                enrolledCourseId: parseInt(d.enrolledCourseId),
                status: d.status || 'Active',
            },
        });
        await logActivity(req.admin.name, 'added', 'Student', d.fullName);
        res.status(201).json(student);
    } catch (error) { next(error); }
}

async function updateStudent(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const d = req.body;
        const updateData = {};
        if (d.fullName !== undefined) updateData.fullName = d.fullName;
        if (d.email !== undefined) updateData.email = d.email;
        if (d.phone !== undefined) updateData.phone = d.phone;
        if (d.photo !== undefined) updateData.photo = d.photo;
        if (d.enrolledCourseId !== undefined) updateData.enrolledCourseId = parseInt(d.enrolledCourseId);
        if (d.status !== undefined) updateData.status = d.status;

        const student = await prisma.student.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Student', student.fullName);
        res.json(student);
    } catch (error) { next(error); }
}

async function deleteStudent(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) return res.status(404).json({ error: 'Student not found.' });
        await prisma.student.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Student', student.fullName);
        res.json({ message: 'Student deleted.' });
    } catch (error) { next(error); }
}

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
