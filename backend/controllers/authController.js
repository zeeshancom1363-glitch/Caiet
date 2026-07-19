// ============================================
// FILE: authController.js
// WHAT IT DOES: Handles admin login and password
// changes. Validates credentials, creates JWT
// tokens, and updates passwords securely.
// Used by: routes/authRoutes.js
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// ---------- POST /api/auth/login ----------
// Admin logs in with email + password → gets a JWT token
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Check both fields are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find admin by email
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Compare the password with the hashed version
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Update last login time
        await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
        });

        // Create a JWT token (expires in 7 days)
        const token = jwt.sign(
            { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send the token and admin info back
        res.json({
            message: 'Login successful!',
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

// ---------- POST /api/auth/change-password ----------
// Admin changes their password (must provide current password)
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminId = req.admin.id; // from JWT middleware

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters.' });
        }

        // Get the admin's current hashed password
        const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }

        // Hash the new password and save it
        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.adminUser.update({
            where: { id: adminId },
            data: { password: hashed },
        });

        res.json({ message: 'Password changed successfully!' });
    } catch (error) {
        next(error);
    }
}

module.exports = { login, changePassword };
