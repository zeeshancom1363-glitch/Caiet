// ============================================
// FILE: slugify.js
// WHAT IT DOES: Turns any text into a URL-safe
// slug. Example: "Flutter App Development" →
// "flutter-app-development"
// Used by: controllers when creating courses,
// services, blogs, categories
// ============================================

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')      // Replace spaces with dashes
        .replace(/[^\w\-]+/g, '')   // Remove non-word characters
        .replace(/\-\-+/g, '-')    // Replace multiple dashes with single
        .replace(/^-+/, '')         // Remove leading dashes
        .replace(/-+$/, '');        // Remove trailing dashes
}

module.exports = slugify;
