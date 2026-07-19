// ============================================
// FILE: activityLogger.js
// WHAT IT DOES: Logs every admin action (add,
// edit, delete) to the ActivityLog table.
// Called automatically by controllers after
// any create/update/delete operation.
// Used by: all admin controllers
// ============================================
const prisma = require('../config/db');

/**
 * Log an admin action to the ActivityLog table.
 *
 * @param {string} adminName  - Name of the admin who did the action
 * @param {string} actionType - "added", "changed", or "deleted"
 * @param {string} itemType   - What kind of thing (e.g. "Course", "Blog Post")
 * @param {string} itemName   - The name/title of the item
 */
async function logActivity(adminName, actionType, itemType, itemName) {
    try {
        await prisma.activityLog.create({
            data: {
                adminName,
                actionType,
                itemType,
                itemName,
            },
        });
    } catch (error) {
        // Don't let logging errors crash the app — just print a warning
        console.warn('⚠️ Failed to log activity:', error.message);
    }
}

module.exports = logActivity;
