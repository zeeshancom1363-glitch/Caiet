// ============================================
// FILE: courseRoutes.js
// WHAT IT DOES: URL routes for courses and
// course categories (public + admin).
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// ----- PUBLIC routes -----
router.get('/public/courses', ctrl.getPublicCourses);
router.get('/public/courses/:slug', ctrl.getPublicCourseBySlug);
router.get('/public/course-categories', ctrl.getPublicCategories);

// ----- ADMIN: Course Categories -----
router.get('/admin/course-categories', verifyAdminToken, ctrl.getAllCategories);
router.post('/admin/course-categories', verifyAdminToken, ctrl.createCategory);
router.put('/admin/course-categories/:id', verifyAdminToken, ctrl.updateCategory);
router.delete('/admin/course-categories/:id', verifyAdminToken, ctrl.deleteCategory);

// ----- ADMIN: Courses -----
router.get('/admin/courses', verifyAdminToken, ctrl.getAllCourses);
router.get('/admin/courses/:id', verifyAdminToken, ctrl.getCourseById);
router.post('/admin/courses', verifyAdminToken, ctrl.createCourse);
router.put('/admin/courses/:id', verifyAdminToken, ctrl.updateCourse);
router.delete('/admin/courses/:id', verifyAdminToken, ctrl.deleteCourse);

module.exports = router;
