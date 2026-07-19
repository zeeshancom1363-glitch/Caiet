// ============================================
// FILE: applicationRoutes.js
// WHAT IT DOES: URL routes for applications.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/applicationController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// PUBLIC — submit application
router.post('/public/applications', ctrl.submitApplication);

// ADMIN
router.get('/admin/applications', verifyAdminToken, ctrl.getAllApplications);
router.get('/admin/applications/:id', verifyAdminToken, ctrl.getApplicationById);
router.put('/admin/applications/:id', verifyAdminToken, ctrl.updateApplicationStatus);
router.delete('/admin/applications/:id', verifyAdminToken, ctrl.deleteApplication);

module.exports = router;
