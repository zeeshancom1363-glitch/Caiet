// ============================================
// FILE: blogRoutes.js
// WHAT IT DOES: URL routes for blog posts.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blogController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// PUBLIC
router.get('/public/blogs', ctrl.getPublicBlogs);
router.get('/public/blogs/:slug', ctrl.getPublicBlogBySlug);

// ADMIN
router.get('/admin/blogs', verifyAdminToken, ctrl.getAllBlogs);
router.get('/admin/blogs/:id', verifyAdminToken, ctrl.getBlogById);
router.post('/admin/blogs', verifyAdminToken, ctrl.createBlog);
router.put('/admin/blogs/:id', verifyAdminToken, ctrl.updateBlog);
router.delete('/admin/blogs/:id', verifyAdminToken, ctrl.deleteBlog);

module.exports = router;
