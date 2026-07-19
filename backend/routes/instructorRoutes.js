// ============================================
// FILE: instructorRoutes.js
// WHAT IT DOES: URL routes for instructors.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/instructorController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/public/instructors', ctrl.getPublicInstructors);

router.get('/admin/instructors', verifyAdminToken, ctrl.getAllInstructors);
router.get('/admin/instructors/:id', verifyAdminToken, ctrl.getInstructorById);
router.post('/admin/instructors', verifyAdminToken, ctrl.createInstructor);
router.put('/admin/instructors/:id', verifyAdminToken, ctrl.updateInstructor);
router.delete('/admin/instructors/:id', verifyAdminToken, ctrl.deleteInstructor);

module.exports = router;
