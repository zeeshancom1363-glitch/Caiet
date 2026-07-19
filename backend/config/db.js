// ============================================
// FILE: db.js
// WHAT IT DOES: Creates and exports ONE shared
// Prisma client instance so every part of the
// backend uses the same database connection.
// Used by: every controller file
// ============================================
const { PrismaClient } = require('@prisma/client');

// Create one Prisma client for the whole app
const prisma = new PrismaClient();

module.exports = prisma;
