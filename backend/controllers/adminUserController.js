// ============================================
// FILE: adminUserController.js
// WHAT IT DOES: Manages admin user accounts —
// list, create, update roles, delete.
// Only superadmins can manage other admins.
// Used by: routes/adminUserRoutes.js
// ============================================
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getAllAdmins(req, res, next) {
    try {
        const admins = await prisma.adminUser.findMany({
            select: { id: true, name: true, email: true, role: true, lastLogin: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        res.json(admins);
    } catch (error) { next(error); }
}

async function createAdmin(req, res, next) {
    try {
        // Only superadmins can create new admins
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ error: 'Only superadmins can create admin accounts.' });
        }
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const admin = await prisma.adminUser.create({
            data: { name, email, password: hashed, role: role || 'editor' },
        });
        await logActivity(req.admin.name, 'added', 'Admin User', name);
        res.status(201).json({
            id: admin.id, name: admin.name, email: admin.email, role: admin.role,
        });
    } catch (error) { next(error); }
}

async function updateAdmin(req, res, next) {
    try {
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ error: 'Only superadmins can edit admin accounts.' });
        }
        const id = parseInt(req.params.id);
        const { name, email, role } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const admin = await prisma.adminUser.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Admin User', admin.name);
        res.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
    } catch (error) { next(error); }
}

async function deleteAdmin(req, res, next) {
    try {
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ error: 'Only superadmins can delete admin accounts.' });
        }
        const id = parseInt(req.params.id);
        // Prevent deleting yourself
        if (id === req.admin.id) {
            return res.status(400).json({ error: 'You cannot delete your own account.' });
        }
        const admin = await prisma.adminUser.findUnique({ where: { id } });
        if (!admin) return res.status(404).json({ error: 'Admin not found.' });
        await prisma.adminUser.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Admin User', admin.name);
        res.json({ message: 'Admin deleted.' });
    } catch (error) { next(error); }
}

module.exports = { getAllAdmins, createAdmin, updateAdmin, deleteAdmin };
