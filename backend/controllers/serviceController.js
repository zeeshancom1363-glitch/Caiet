// ============================================
// FILE: serviceController.js
// WHAT IT DOES: All logic for services and service
// categories — public listing and admin CRUD.
// Used by: routes/serviceRoutes.js
// ============================================
const prisma = require('../config/db');
const slugify = require('../utils/slugify');
const logActivity = require('../utils/activityLogger');

// ========== PUBLIC ==========

async function getPublicServices(req, res, next) {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            include: { category: { select: { name: true, slug: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(services);
    } catch (error) { next(error); }
}

async function getPublicServiceBySlug(req, res, next) {
    try {
        const service = await prisma.service.findUnique({
            where: { slug: req.params.slug },
            include: { category: true },
        });
        if (!service || !service.isActive) return res.status(404).json({ error: 'Service not found.' });
        res.json(service);
    } catch (error) { next(error); }
}

async function getPublicServiceCategories(req, res, next) {
    try {
        const cats = await prisma.serviceCategory.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json(cats);
    } catch (error) { next(error); }
}

async function getPublicServicesPage(req, res, next) {
    try {
        let settings = await prisma.servicesPageSettings.findFirst();
        if (!settings) {
            settings = await prisma.servicesPageSettings.create({ data: {} });
        }
        res.json(settings);
    } catch (error) { next(error); }
}

// ========== ADMIN SERVICES ==========

async function getAllServices(req, res, next) {
    try {
        const services = await prisma.service.findMany({
            include: { category: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(services);
    } catch (error) { next(error); }
}

async function getServiceById(req, res, next) {
    try {
        const service = await prisma.service.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { category: true },
        });
        if (!service) return res.status(404).json({ error: 'Service not found.' });
        res.json(service);
    } catch (error) { next(error); }
}

async function createService(req, res, next) {
    try {
        const d = req.body;
        const service = await prisma.service.create({
            data: {
                title: d.title, slug: slugify(d.title),
                categoryId: parseInt(d.categoryId),
                shortDescription: d.shortDescription || '',
                fullDescription: d.fullDescription || '',
                image: d.image || null, iconName: d.iconName || 'Briefcase',
                priceText: d.priceText || null,
                isFeatured: d.isFeatured === true || d.isFeatured === 'true',
                isActive: d.isActive !== false && d.isActive !== 'false',
            },
        });
        await logActivity(req.admin.name, 'added', 'Service', d.title);
        res.status(201).json(service);
    } catch (error) { next(error); }
}

async function updateService(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const d = req.body;
        const updateData = {};
        if (d.title) { updateData.title = d.title; updateData.slug = slugify(d.title); }
        if (d.categoryId) updateData.categoryId = parseInt(d.categoryId);
        if (d.shortDescription !== undefined) updateData.shortDescription = d.shortDescription;
        if (d.fullDescription !== undefined) updateData.fullDescription = d.fullDescription;
        if (d.image !== undefined) updateData.image = d.image;
        if (d.iconName !== undefined) updateData.iconName = d.iconName;
        if (d.priceText !== undefined) updateData.priceText = d.priceText;
        if (d.isFeatured !== undefined) updateData.isFeatured = d.isFeatured === true || d.isFeatured === 'true';
        if (d.isActive !== undefined) updateData.isActive = d.isActive === true || d.isActive === 'true';

        const service = await prisma.service.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Service', service.title);
        res.json(service);
    } catch (error) { next(error); }
}

async function deleteService(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const svc = await prisma.service.findUnique({ where: { id } });
        if (!svc) return res.status(404).json({ error: 'Service not found.' });
        await prisma.service.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Service', svc.title);
        res.json({ message: 'Service deleted.' });
    } catch (error) { next(error); }
}

// ========== ADMIN SERVICE CATEGORIES ==========

async function getAllServiceCategories(req, res, next) {
    try {
        const cats = await prisma.serviceCategory.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json(cats);
    } catch (error) { next(error); }
}

async function createServiceCategory(req, res, next) {
    try {
        const { name, description, iconName, displayOrder } = req.body;
        const cat = await prisma.serviceCategory.create({
            data: { name, slug: slugify(name), description: description || '', iconName: iconName || 'Briefcase', displayOrder: parseInt(displayOrder) || 0 },
        });
        await logActivity(req.admin.name, 'added', 'Service Category', name);
        res.status(201).json(cat);
    } catch (error) { next(error); }
}

async function updateServiceCategory(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { name, description, iconName, displayOrder } = req.body;
        const updateData = {};
        if (name) { updateData.name = name; updateData.slug = slugify(name); }
        if (description !== undefined) updateData.description = description;
        if (iconName !== undefined) updateData.iconName = iconName;
        if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
        const cat = await prisma.serviceCategory.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Service Category', cat.name);
        res.json(cat);
    } catch (error) { next(error); }
}

async function deleteServiceCategory(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const cat = await prisma.serviceCategory.findUnique({ where: { id } });
        if (!cat) return res.status(404).json({ error: 'Category not found.' });
        await prisma.serviceCategory.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Service Category', cat.name);
        res.json({ message: 'Category deleted.' });
    } catch (error) { next(error); }
}

// ========== ADMIN SERVICES PAGE SETTINGS (singleton) ==========

async function getServicesPageSettings(req, res, next) {
    try {
        let settings = await prisma.servicesPageSettings.findFirst();
        if (!settings) settings = await prisma.servicesPageSettings.create({ data: {} });
        res.json(settings);
    } catch (error) { next(error); }
}

async function updateServicesPageSettings(req, res, next) {
    try {
        const d = req.body;
        let settings = await prisma.servicesPageSettings.findFirst();
        if (!settings) settings = await prisma.servicesPageSettings.create({ data: {} });

        const updated = await prisma.servicesPageSettings.update({
            where: { id: settings.id },
            data: {
                pageHeading: d.pageHeading !== undefined ? d.pageHeading : settings.pageHeading,
                pageSubheading: d.pageSubheading !== undefined ? d.pageSubheading : settings.pageSubheading,
                introText: d.introText !== undefined ? d.introText : settings.introText,
                bannerImage: d.bannerImage !== undefined ? d.bannerImage : settings.bannerImage,
            },
        });
        await logActivity(req.admin.name, 'changed', 'Services Page Settings', 'Services Page');
        res.json(updated);
    } catch (error) { next(error); }
}

module.exports = {
    getPublicServices, getPublicServiceBySlug, getPublicServiceCategories, getPublicServicesPage,
    getAllServices, getServiceById, createService, updateService, deleteService,
    getAllServiceCategories, createServiceCategory, updateServiceCategory, deleteServiceCategory,
    getServicesPageSettings, updateServicesPageSettings,
};
