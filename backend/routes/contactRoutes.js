// ============================================
// FILE: contactRoutes.js
// WHAT IT DOES: URL routes for contact messages.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.post('/public/contact', ctrl.submitContact);

router.get('/admin/contact-messages', verifyAdminToken, ctrl.getAllMessages);
router.get('/admin/contact-messages/:id', verifyAdminToken, ctrl.getMessageById);
router.delete('/admin/contact-messages/:id', verifyAdminToken, ctrl.deleteMessage);

module.exports = router;
