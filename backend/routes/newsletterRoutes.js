// ============================================
// FILE: newsletterRoutes.js
// WHAT IT DOES: URL routes for newsletter.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/newsletterController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.post('/public/newsletter', ctrl.subscribe);

router.get('/admin/newsletter', verifyAdminToken, ctrl.getAllSubscribers);
router.delete('/admin/newsletter/:id', verifyAdminToken, ctrl.deleteSubscriber);
router.get('/admin/newsletter/export', verifyAdminToken, ctrl.exportCSV);

module.exports = router;
