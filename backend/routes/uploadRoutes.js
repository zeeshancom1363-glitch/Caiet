// ============================================
// FILE: uploadRoutes.js
// WHAT IT DOES: Handles image upload endpoint.
// Admin uploads an image → gets back the file path.
// Used by: server.js
// ============================================
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadImage');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// POST /api/admin/upload — Upload a single image
router.post('/admin/upload', verifyAdminToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
    }
    // Return the path that can be used to display the image
    const filePath = `/uploads/${req.file.filename}`;
    res.json({
        message: 'Image uploaded successfully!',
        filePath,
        fileName: req.file.filename,
    });
});

module.exports = router;
