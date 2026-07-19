// ============================================
// FILE: serviceRoutes.js
// WHAT IT DOES: URL routes for services, service
// categories, and services page settings.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/serviceController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// PUBLIC
router.get('/public/services', ctrl.getPublicServices);
router.get('/public/services/:slug', ctrl.getPublicServiceBySlug);
router.get('/public/service-categories', ctrl.getPublicServiceCategories);
router.get('/public/services-page', ctrl.getPublicServicesPage);

// ADMIN: Service Categories
router.get('/admin/service-categories', verifyAdminToken, ctrl.getAllServiceCategories);
router.post('/admin/service-categories', verifyAdminToken, ctrl.createServiceCategory);
router.put('/admin/service-categories/:id', verifyAdminToken, ctrl.updateServiceCategory);
router.delete('/admin/service-categories/:id', verifyAdminToken, ctrl.deleteServiceCategory);

// ADMIN: Services
router.get('/admin/services', verifyAdminToken, ctrl.getAllServices);
router.get('/admin/services/:id', verifyAdminToken, ctrl.getServiceById);
router.post('/admin/services', verifyAdminToken, ctrl.createService);
router.put('/admin/services/:id', verifyAdminToken, ctrl.updateService);
router.delete('/admin/services/:id', verifyAdminToken, ctrl.deleteService);

// ADMIN: Services Page Settings (singleton)
router.get('/admin/services-page', verifyAdminToken, ctrl.getServicesPageSettings);
router.put('/admin/services-page', verifyAdminToken, ctrl.updateServicesPageSettings);

module.exports = router;
