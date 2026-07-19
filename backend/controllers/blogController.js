// ============================================
// FILE: blogController.js
// WHAT IT DOES: All the logic for blog posts —
// list, view, create, edit, delete, view count.
// Used by: routes/blogRoutes.js
// ============================================
const prisma = require('../config/db');
const slugify = require('../utils/slugify');
const logActivity = require('../utils/activityLogger');

// ========== PUBLIC ==========

// GET /api/public/blogs — Get all published blog posts
async function getPublicBlogs(req, res, next) {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true, title: true, slug: true, coverImage: true,
                excerpt: true, authorName: true, category: true,
                tags: true, publishedAt: true, viewsCount: true,
            },
        });
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

// GET /api/public/blogs/:slug — Get one blog post + increment views
async function getPublicBlogBySlug(req, res, next) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug: req.params.slug },
        });
        if (!post || !post.isPublished) {
            return res.status(404).json({ error: 'Blog post not found.' });
        }

        // Increment view count
        await prisma.blogPost.update({
            where: { id: post.id },
            data: { viewsCount: post.viewsCount + 1 },
        });

        res.json({ ...post, viewsCount: post.viewsCount + 1 });
    } catch (error) {
        next(error);
    }
}

// ========== ADMIN ==========

async function getAllBlogs(req, res, next) {
    try {
        const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function getBlogById(req, res, next) {
    try {
        const post = await prisma.blogPost.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!post) return res.status(404).json({ error: 'Blog post not found.' });
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function createBlog(req, res, next) {
    try {
        const data = req.body;
        const post = await prisma.blogPost.create({
            data: {
                title: data.title,
                slug: slugify(data.title),
                coverImage: data.coverImage || null,
                excerpt: data.excerpt || '',
                content: data.content || '',
                authorName: data.authorName || 'CAI&ET Team',
                category: data.category || 'General',
                tags: data.tags || '',
                isPublished: data.isPublished === true || data.isPublished === 'true',
                publishedAt: data.isPublished ? new Date() : null,
            },
        });
        await logActivity(req.admin.name, 'added', 'Blog Post', data.title);
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
}

async function updateBlog(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updateData = {};

        if (data.title) { updateData.title = data.title; updateData.slug = slugify(data.title); }
        if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
        if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
        if (data.content !== undefined) updateData.content = data.content;
        if (data.authorName !== undefined) updateData.authorName = data.authorName;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.tags !== undefined) updateData.tags = data.tags;
        if (data.isPublished !== undefined) {
            updateData.isPublished = data.isPublished === true || data.isPublished === 'true';
            if (updateData.isPublished) updateData.publishedAt = new Date();
        }

        const post = await prisma.blogPost.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Blog Post', post.title);
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function deleteBlog(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const post = await prisma.blogPost.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: 'Blog post not found.' });
        await prisma.blogPost.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Blog Post', post.title);
        res.json({ message: 'Blog post deleted.' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPublicBlogs, getPublicBlogBySlug,
    getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog,
};
