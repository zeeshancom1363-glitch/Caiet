// ============================================
// FILE: studentRoutes.js
// WHAT IT DOES: URL routes for students.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.get('/admin/students', verifyAdminToken, ctrl.getAllStudents);
router.get('/admin/students/:id', verifyAdminToken, ctrl.getStudentById);
router.post('/admin/students', verifyAdminToken, ctrl.createStudent);
router.put('/admin/students/:id', verifyAdminToken, ctrl.updateStudent);
router.delete('/admin/students/:id', verifyAdminToken, ctrl.deleteStudent);

module.exports = router;
