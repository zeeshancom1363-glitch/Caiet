// ============================================
// FILE: teamRoutes.js
// WHAT IT DOES: URL routes for team members.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teamController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/public/team', ctrl.getPublicTeam);

router.get('/admin/team', verifyAdminToken, ctrl.getAllTeam);
router.get('/admin/team/:id', verifyAdminToken, ctrl.getTeamById);
router.post('/admin/team', verifyAdminToken, ctrl.createTeamMember);
router.put('/admin/team/:id', verifyAdminToken, ctrl.updateTeamMember);
router.delete('/admin/team/:id', verifyAdminToken, ctrl.deleteTeamMember);

module.exports = router;
