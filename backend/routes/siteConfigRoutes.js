// ============================================
// FILE: siteConfigRoutes.js
// WHAT IT DOES: URL routes for site configurations.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/siteConfigController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/admin/site-configurations', verifyAdminToken, ctrl.getAllConfigs);
router.post('/admin/site-configurations', verifyAdminToken, ctrl.createConfig);
router.put('/admin/site-configurations/:id', verifyAdminToken, ctrl.updateConfig);
router.delete('/admin/site-configurations/:id', verifyAdminToken, ctrl.deleteConfig);

module.exports = router;
