// ============================================
// FILE: settingsController.js
// WHAT IT DOES: Handles all singleton settings —
// SiteSettings, BannerSettings, AboutSection.
// These tables have only ONE row that gets edited.
// Used by: routes/settingsRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

// ========== SITE SETTINGS ==========

async function getSiteSettings(req, res, next) {
    try {
        let settings = await prisma.siteSettings.findFirst();
        if (!settings) settings = await prisma.siteSettings.create({ data: {} });
        res.json(settings);
    } catch (error) { next(error); }
}

async function updateSiteSettings(req, res, next) {
    try {
        let settings = await prisma.siteSettings.findFirst();
        if (!settings) settings = await prisma.siteSettings.create({ data: {} });

        const d = req.body;
        const updated = await prisma.siteSettings.update({
            where: { id: settings.id },
            data: {
                siteName: d.siteName !== undefined ? d.siteName : settings.siteName,
                tagline: d.tagline !== undefined ? d.tagline : settings.tagline,
                logoImage: d.logoImage !== undefined ? d.logoImage : settings.logoImage,
                faviconImage: d.faviconImage !== undefined ? d.faviconImage : settings.faviconImage,
                email: d.email !== undefined ? d.email : settings.email,
                phone: d.phone !== undefined ? d.phone : settings.phone,
                whatsappNumber: d.whatsappNumber !== undefined ? d.whatsappNumber : settings.whatsappNumber,
                address: d.address !== undefined ? d.address : settings.address,
                facebookUrl: d.facebookUrl !== undefined ? d.facebookUrl : settings.facebookUrl,
                instagramUrl: d.instagramUrl !== undefined ? d.instagramUrl : settings.instagramUrl,
                linkedinUrl: d.linkedinUrl !== undefined ? d.linkedinUrl : settings.linkedinUrl,
                youtubeUrl: d.youtubeUrl !== undefined ? d.youtubeUrl : settings.youtubeUrl,
                footerAboutText: d.footerAboutText !== undefined ? d.footerAboutText : settings.footerAboutText,
                mapEmbedUrl: d.mapEmbedUrl !== undefined ? d.mapEmbedUrl : settings.mapEmbedUrl,
            },
        });
        await logActivity(req.admin.name, 'changed', 'Site Settings', 'Site Settings');
        res.json(updated);
    } catch (error) { next(error); }
}

// ========== BANNER SETTINGS ==========

async function getBannerSettings(req, res, next) {
    try {
        let banner = await prisma.bannerSettings.findFirst();
        if (!banner) banner = await prisma.bannerSettings.create({ data: {} });
        res.json(banner);
    } catch (error) { next(error); }
}

async function updateBannerSettings(req, res, next) {
    try {
        let banner = await prisma.bannerSettings.findFirst();
        if (!banner) banner = await prisma.bannerSettings.create({ data: {} });

        const d = req.body;
        const updated = await prisma.bannerSettings.update({
            where: { id: banner.id },
            data: {
                mainText: d.mainText !== undefined ? d.mainText : banner.mainText,
                highlightText: d.highlightText !== undefined ? d.highlightText : banner.highlightText,
                linkUrl: d.linkUrl !== undefined ? d.linkUrl : banner.linkUrl,
                isActive: d.isActive !== undefined ? (d.isActive === true || d.isActive === 'true') : banner.isActive,
            },
        });
        await logActivity(req.admin.name, 'changed', 'Banner Settings', 'Announcement Banner');
        res.json(updated);
    } catch (error) { next(error); }
}

// ========== ABOUT SECTION ==========

async function getAboutSection(req, res, next) {
    try {
        let about = await prisma.aboutSection.findFirst();
        if (!about) about = await prisma.aboutSection.create({ data: {} });
        res.json(about);
    } catch (error) { next(error); }
}

async function updateAboutSection(req, res, next) {
    try {
        let about = await prisma.aboutSection.findFirst();
        if (!about) about = await prisma.aboutSection.create({ data: {} });

        const d = req.body;
        const updated = await prisma.aboutSection.update({
            where: { id: about.id },
            data: {
                heading: d.heading !== undefined ? d.heading : about.heading,
                description: d.description !== undefined ? d.description : about.description,
                image: d.image !== undefined ? d.image : about.image,
                missionText: d.missionText !== undefined ? d.missionText : about.missionText,
                visionText: d.visionText !== undefined ? d.visionText : about.visionText,
                yearsExperience: d.yearsExperience !== undefined ? parseInt(d.yearsExperience) : about.yearsExperience,
                studentsCount: d.studentsCount !== undefined ? parseInt(d.studentsCount) : about.studentsCount,
                coursesCount: d.coursesCount !== undefined ? parseInt(d.coursesCount) : about.coursesCount,
                instructorsCount: d.instructorsCount !== undefined ? parseInt(d.instructorsCount) : about.instructorsCount,
            },
        });
        await logActivity(req.admin.name, 'changed', 'About Section', 'About Page');
        res.json(updated);
    } catch (error) { next(error); }
}

module.exports = {
    getSiteSettings, updateSiteSettings,
    getBannerSettings, updateBannerSettings,
    getAboutSection, updateAboutSection,
};
