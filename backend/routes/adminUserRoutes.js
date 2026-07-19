// ============================================
// FILE: adminUserRoutes.js
// WHAT IT DOES: URL routes for admin user management.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminUserController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/admin/admin-users', verifyAdminToken, ctrl.getAllAdmins);
router.post('/admin/admin-users', verifyAdminToken, ctrl.createAdmin);
router.put('/admin/admin-users/:id', verifyAdminToken, ctrl.updateAdmin);
router.delete('/admin/admin-users/:id', verifyAdminToken, ctrl.deleteAdmin);

module.exports = router;
