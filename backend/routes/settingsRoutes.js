// ============================================
// FILE: settingsRoutes.js
// WHAT IT DOES: URL routes for singleton settings —
// SiteSettings, BannerSettings, AboutSection.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settingsController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// PUBLIC
router.get('/public/settings', ctrl.getSiteSettings);
router.get('/public/banner', ctrl.getBannerSettings);
router.get('/public/about', ctrl.getAboutSection);

// ADMIN (singleton — only GET and PUT, no POST/DELETE)
router.get('/admin/site-settings', verifyAdminToken, ctrl.getSiteSettings);
router.put('/admin/site-settings', verifyAdminToken, ctrl.updateSiteSettings);

router.get('/admin/banner-settings', verifyAdminToken, ctrl.getBannerSettings);
router.put('/admin/banner-settings', verifyAdminToken, ctrl.updateBannerSettings);

router.get('/admin/about-section', verifyAdminToken, ctrl.getAboutSection);
router.put('/admin/about-section', verifyAdminToken, ctrl.updateAboutSection);

module.exports = router;
