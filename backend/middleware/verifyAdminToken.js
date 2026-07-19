// ============================================
// FILE: verifyAdminToken.js
// WHAT IT DOES: Middleware that checks if the
// request has a valid JWT token. If not, it
// blocks access and sends a 401 error.
// Used by: all admin routes
// ============================================
const jwt = require('jsonwebtoken');

function verifyAdminToken(req, res, next) {
    try {
        // Get the token from the Authorization header
        // Format: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided. Please log in.' });
        }

        // Extract just the token part (remove "Bearer ")
        const token = authHeader.split(' ')[1];

        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the admin info to the request so controllers can use it
        req.admin = decoded;

        // Token is valid — let the request continue
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
}

module.exports = verifyAdminToken;
