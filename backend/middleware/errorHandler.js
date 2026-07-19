// ============================================
// FILE: errorHandler.js
// WHAT IT DOES: Central error handler. If any
// route throws an error, this catches it and
// sends a clean JSON response instead of crashing.
// Used by: server.js (app.use at the end)
// ============================================
function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err.message);

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }

    // Multer file type error
    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ error: err.message });
    }

    // Prisma unique constraint error
    if (err.code === 'P2002') {
        return res.status(400).json({ error: 'A record with this value already exists.' });
    }

    // Prisma record not found
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found.' });
    }

    // Default server error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Something went wrong on the server.',
    });
}

module.exports = errorHandler;
