const path = require('path');

/**
 * Robustly determines the persistent data volume path.
 * 1. Uses process.env.DATA_VOLUME if set (e.g., '/data').
 * 2. Fallbacks to extracting the directory from DATABASE_URL (e.g., 'file:/data/dev.db' -> '/data').
 * 3. Falls back to a local 'data' folder for local development.
 * 
 * @returns {string} The absolute path to the data volume.
 */
function getDataVolumePath() {
    if (process.env.DATA_VOLUME) {
        return process.env.DATA_VOLUME;
    }

    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
        // e.g. "file:/data/dev.db" -> "/data/dev.db"
        const dbPath = process.env.DATABASE_URL.replace('file:', '');

        // If it's a relative path locally like "file:./dev.db"
        if (!path.isAbsolute(dbPath)) {
            return path.join(process.cwd(), path.dirname(dbPath));
        }

        // e.g. "/data"
        return path.dirname(dbPath);
    }

    // Default local fallback
    return path.join(process.cwd(), 'data');
}

/**
 * Returns the uploads folder path inside the data volume.
 */
function getUploadsPath() {
    return path.join(getDataVolumePath(), 'uploads');
}

module.exports = {
    getDataVolumePath,
    getUploadsPath
};
