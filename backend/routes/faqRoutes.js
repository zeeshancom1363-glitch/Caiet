// ============================================
// FILE: faqRoutes.js
// WHAT IT DOES: URL routes for FAQs.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/faqController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/public/faqs', ctrl.getPublicFAQs);

router.get('/admin/faqs', verifyAdminToken, ctrl.getAllFAQs);
router.post('/admin/faqs', verifyAdminToken, ctrl.createFAQ);
router.put('/admin/faqs/:id', verifyAdminToken, ctrl.updateFAQ);
router.delete('/admin/faqs/:id', verifyAdminToken, ctrl.deleteFAQ);

module.exports = router;
