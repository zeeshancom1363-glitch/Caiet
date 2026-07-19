// ============================================
// FILE: server.js
// WHAT IT DOES: The MAIN file that starts the
// backend server. It loads environment variables,
// connects all routes, enables CORS, serves
// uploaded images, and starts listening on the port.
// HOW TO RUN: npm run dev (uses nodemon for auto-reload)
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Import all route files
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const blogRoutes = require('./routes/blogRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const teamRoutes = require('./routes/teamRoutes');
const faqRoutes = require('./routes/faqRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const studentRoutes = require('./routes/studentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
const siteConfigRoutes = require('./routes/siteConfigRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Create the Express app
const app = express();

// ---- MIDDLEWARE ----

// Allow requests from the frontend
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin, localhost, vercel deployments, or custom FRONTEND_URL
        if (!origin ||
            origin.startsWith('http://localhost') ||
            origin.startsWith('http://127.0.0.1') ||
            origin.endsWith('.vercel.app') ||
            origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('CORS blocked origin: ' + origin));
        }
    },
    credentials: true,
}));

// Parse JSON request bodies (for POST/PUT requests)
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

const { getUploadsPath } = require('./utils/volumePath');
const fs = require('fs');

// Serve uploaded images as static files
const uploadsPath = getUploadsPath();
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// ---- ROUTES ----
// All routes are prefixed with /api
app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', blogRoutes);
app.use('/api', serviceRoutes);
app.use('/api', settingsRoutes);
app.use('/api', instructorRoutes);
app.use('/api', teamRoutes);
app.use('/api', faqRoutes);
app.use('/api', applicationRoutes);
app.use('/api', studentRoutes);
app.use('/api', contactRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', adminUserRoutes);
app.use('/api', emailTemplateRoutes);
app.use('/api', siteConfigRoutes);
app.use('/api', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CAI&ET Backend is running! 🚀' });
});

// ---- ERROR HANDLER ----
// Must be the LAST middleware (catches all errors)
app.use(errorHandler);

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('');
    console.log('🚀 ============================================');
    console.log(`🚀  CAI&ET Backend running on port ${PORT}`);
    console.log(`🚀  API: http://localhost:${PORT}/api/health`);
    console.log(`🚀  Uploads: http://localhost:${PORT}/uploads/`);
    console.log('🚀 ============================================');
    console.log('');
});
