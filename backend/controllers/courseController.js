// ============================================
// FILE: courseController.js
// WHAT IT DOES: All the logic for courses —
// get all courses, get one course, add, edit, delete.
// Used by: routes/courseRoutes.js
// ============================================
const prisma = require('../config/db');
const slugify = require('../utils/slugify');
const logActivity = require('../utils/activityLogger');

// ========== PUBLIC ENDPOINTS ==========

// GET /api/public/courses — Get all active courses (with category & instructor)
async function getPublicCourses(req, res, next) {
    try {
        const courses = await prisma.course.findMany({
            where: { isActive: true },
            include: {
                category: { select: { name: true, slug: true } },
                instructor: { select: { fullName: true, photo: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(courses);
    } catch (error) {
        next(error);
    }
}

// GET /api/public/courses/:slug — Get one course by slug
async function getPublicCourseBySlug(req, res, next) {
    try {
        const course = await prisma.course.findUnique({
            where: { slug: req.params.slug },
            include: {
                category: true,
                instructor: true,
            },
        });
        if (!course || !course.isActive) {
            return res.status(404).json({ error: 'Course not found.' });
        }
        res.json(course);
    } catch (error) {
        next(error);
    }
}

// GET /api/public/course-categories — Get all categories
async function getPublicCategories(req, res, next) {
    try {
        const categories = await prisma.courseCategory.findMany({
            orderBy: { displayOrder: 'asc' },
            include: { courses: { where: { isActive: true }, select: { id: true } } },
        });
        // Add course count to each category
        const result = categories.map(cat => ({
            ...cat,
            courseCount: cat.courses.length,
            courses: undefined,
        }));
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// ========== ADMIN ENDPOINTS ==========

// GET /api/admin/courses — Get ALL courses (including inactive)
async function getAllCourses(req, res, next) {
    try {
        const courses = await prisma.course.findMany({
            include: {
                category: { select: { name: true } },
                instructor: { select: { fullName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(courses);
    } catch (error) {
        next(error);
    }
}

// GET /api/admin/courses/:id — Get one course by ID
async function getCourseById(req, res, next) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { category: true, instructor: true },
        });
        if (!course) return res.status(404).json({ error: 'Course not found.' });
        res.json(course);
    } catch (error) {
        next(error);
    }
}

// POST /api/admin/courses — Create a new course
async function createCourse(req, res, next) {
    try {
        const data = req.body;
        const slug = slugify(data.title);

        const course = await prisma.course.create({
            data: {
                title: data.title,
                slug,
                categoryId: parseInt(data.categoryId),
                shortDescription: data.shortDescription || '',
                fullDescription: data.fullDescription || '',
                image: data.image || null,
                price: parseFloat(data.price) || 0,
                discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
                durationText: data.durationText || '',
                level: data.level || 'Beginner',
                instructorId: data.instructorId ? parseInt(data.instructorId) : null,
                syllabus: data.syllabus || '',
                totalSeats: parseInt(data.totalSeats) || 30,
                startDate: data.startDate || null,
                isFeatured: data.isFeatured === true || data.isFeatured === 'true',
                isActive: data.isActive !== false && data.isActive !== 'false',
            },
        });

        // Log this action
        await logActivity(req.admin.name, 'added', 'Course', data.title);

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
}

// PUT /api/admin/courses/:id — Update a course
async function updateCourse(req, res, next) {
    try {
        const data = req.body;
        const id = parseInt(req.params.id);

        const updateData = {
            title: data.title,
            slug: data.title ? slugify(data.title) : undefined,
            categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            image: data.image,
            price: data.price !== undefined ? parseFloat(data.price) : undefined,
            discountPrice: data.discountPrice !== undefined
                ? (data.discountPrice ? parseFloat(data.discountPrice) : null)
                : undefined,
            durationText: data.durationText,
            level: data.level,
            instructorId: data.instructorId ? parseInt(data.instructorId) : undefined,
            syllabus: data.syllabus,
            totalSeats: data.totalSeats ? parseInt(data.totalSeats) : undefined,
            startDate: data.startDate,
            isFeatured: data.isFeatured !== undefined
                ? (data.isFeatured === true || data.isFeatured === 'true')
                : undefined,
            isActive: data.isActive !== undefined
                ? (data.isActive === true || data.isActive === 'true')
                : undefined,
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const course = await prisma.course.update({ where: { id }, data: updateData });

        await logActivity(req.admin.name, 'changed', 'Course', course.title);

        res.json(course);
    } catch (error) {
        next(error);
    }
}

// DELETE /api/admin/courses/:id — Delete a course
async function deleteCourse(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) return res.status(404).json({ error: 'Course not found.' });

        await prisma.course.delete({ where: { id } });

        await logActivity(req.admin.name, 'deleted', 'Course', course.title);

        res.json({ message: 'Course deleted successfully.' });
    } catch (error) {
        next(error);
    }
}

// ========== ADMIN CATEGORY ENDPOINTS ==========

async function getAllCategories(req, res, next) {
    try {
        const categories = await prisma.courseCategory.findMany({
            orderBy: { displayOrder: 'asc' },
        });
        res.json(categories);
    } catch (error) {
        next(error);
    }
}

async function createCategory(req, res, next) {
    try {
        const { name, description, iconName, displayOrder } = req.body;
        const slug = slugify(name);
        const category = await prisma.courseCategory.create({
            data: { name, slug, description: description || '', iconName: iconName || 'BookOpen', displayOrder: parseInt(displayOrder) || 0 },
        });
        await logActivity(req.admin.name, 'added', 'Course Category', name);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

async function updateCategory(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { name, description, iconName, displayOrder } = req.body;
        const updateData = {};
        if (name) { updateData.name = name; updateData.slug = slugify(name); }
        if (description !== undefined) updateData.description = description;
        if (iconName !== undefined) updateData.iconName = iconName;
        if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);

        const category = await prisma.courseCategory.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Course Category', category.name);
        res.json(category);
    } catch (error) {
        next(error);
    }
}

async function deleteCategory(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const cat = await prisma.courseCategory.findUnique({ where: { id } });
        if (!cat) return res.status(404).json({ error: 'Category not found.' });
        await prisma.courseCategory.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Course Category', cat.name);
        res.json({ message: 'Category deleted.' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPublicCourses, getPublicCourseBySlug, getPublicCategories,
    getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,
    getAllCategories, createCategory, updateCategory, deleteCategory,
};
