// ============================================
// FILE: dashboardRoutes.js
// WHAT IT DOES: URL routes for dashboard stats.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/admin/dashboard-stats', verifyAdminToken, ctrl.getDashboardStats);
router.get('/admin/activity-log', verifyAdminToken, ctrl.getActivityLog);
router.get('/admin/recent-applications', verifyAdminToken, ctrl.getRecentApplications);

module.exports = router;
