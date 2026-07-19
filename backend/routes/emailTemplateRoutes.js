// ============================================
// FILE: emailTemplateRoutes.js
// WHAT IT DOES: URL routes for email templates.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/emailTemplateController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/admin/email-templates', verifyAdminToken, ctrl.getAllTemplates);
router.get('/admin/email-templates/:id', verifyAdminToken, ctrl.getTemplateById);
router.post('/admin/email-templates', verifyAdminToken, ctrl.createTemplate);
router.put('/admin/email-templates/:id', verifyAdminToken, ctrl.updateTemplate);
router.delete('/admin/email-templates/:id', verifyAdminToken, ctrl.deleteTemplate);

module.exports = router;
