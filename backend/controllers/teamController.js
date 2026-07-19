// ============================================
// FILE: teamController.js
// WHAT IT DOES: CRUD for team members shown
// on the About page and homepage slider.
// Used by: routes/teamRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getPublicTeam(req, res, next) {
    try {
        const members = await prisma.teamMember.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
        res.json(members);
    } catch (error) { next(error); }
}

async function getAllTeam(req, res, next) {
    try {
        const members = await prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json(members);
    } catch (error) { next(error); }
}

async function getTeamById(req, res, next) {
    try {
        const member = await prisma.teamMember.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!member) return res.status(404).json({ error: 'Team member not found.' });
        res.json(member);
    } catch (error) { next(error); }
}

async function createTeamMember(req, res, next) {
    try {
        const d = req.body;
        const member = await prisma.teamMember.create({
            data: {
                fullName: d.fullName, designation: d.designation || '',
                photo: d.photo || null, bio: d.bio || '',
                linkedinUrl: d.linkedinUrl || '', facebookUrl: d.facebookUrl || '',
                displayOrder: parseInt(d.displayOrder) || 0,
                isActive: d.isActive !== false && d.isActive !== 'false',
            },
        });
        await logActivity(req.admin.name, 'added', 'Team Member', d.fullName);
        res.status(201).json(member);
    } catch (error) { next(error); }
}

async function updateTeamMember(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const d = req.body;
        const updateData = {};
        if (d.fullName !== undefined) updateData.fullName = d.fullName;
        if (d.designation !== undefined) updateData.designation = d.designation;
        if (d.photo !== undefined) updateData.photo = d.photo;
        if (d.bio !== undefined) updateData.bio = d.bio;
        if (d.linkedinUrl !== undefined) updateData.linkedinUrl = d.linkedinUrl;
        if (d.facebookUrl !== undefined) updateData.facebookUrl = d.facebookUrl;
        if (d.displayOrder !== undefined) updateData.displayOrder = parseInt(d.displayOrder);
        if (d.isActive !== undefined) updateData.isActive = d.isActive === true || d.isActive === 'true';

        const member = await prisma.teamMember.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Team Member', member.fullName);
        res.json(member);
    } catch (error) { next(error); }
}

async function deleteTeamMember(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const m = await prisma.teamMember.findUnique({ where: { id } });
        if (!m) return res.status(404).json({ error: 'Team member not found.' });
        await prisma.teamMember.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Team Member', m.fullName);
        res.json({ message: 'Team member deleted.' });
    } catch (error) { next(error); }
}

module.exports = {
    getPublicTeam, getAllTeam, getTeamById,
    createTeamMember, updateTeamMember, deleteTeamMember,
};
