// ============================================
// FILE: uploadImage.js
// WHAT IT DOES: Configures Multer to handle file
// uploads. Files are saved to backend/uploads/
// with unique filenames. Only image files allowed.
// Used by: routes that need image uploads
// ============================================
const multer = require('multer');
const path = require('path');

// Configure where uploaded files go and what they're named
const storage = multer.diskStorage({
    // Save all uploads to the "uploads" folder
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    // Give each file a unique name: timestamp + random number + original extension
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    },
});

// Only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed!'), false);
    }
};

// Create the upload middleware (max 5MB per file)
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
