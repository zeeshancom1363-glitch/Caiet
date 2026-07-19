// ============================================
// FILE: authRoutes.js
// WHAT IT DOES: URL routes for admin login and
// password change.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../controllers/authController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// POST /api/auth/login — Admin login (no token needed)
router.post('/auth/login', login);

// POST /api/auth/change-password — Change password (token required)
router.post('/auth/change-password', verifyAdminToken, changePassword);

module.exports = router;
