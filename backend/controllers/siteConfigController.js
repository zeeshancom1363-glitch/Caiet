// ============================================
// FILE: siteConfigController.js
// WHAT IT DOES: CRUD for flexible key/value
// site configurations.
// Used by: routes/siteConfigRoutes.js
// ============================================
const prisma = require('../config/db');
const logActivity = require('../utils/activityLogger');

async function getAllConfigs(req, res, next) {
    try {
        const configs = await prisma.siteConfiguration.findMany({ orderBy: { configKey: 'asc' } });
        res.json(configs);
    } catch (error) { next(error); }
}

async function createConfig(req, res, next) {
    try {
        const { configKey, configValue } = req.body;
        if (!configKey) return res.status(400).json({ error: 'Config key is required.' });
        const config = await prisma.siteConfiguration.create({
            data: { configKey, configValue: configValue || '' },
        });
        await logActivity(req.admin.name, 'added', 'Site Configuration', configKey);
        res.status(201).json(config);
    } catch (error) { next(error); }
}

async function updateConfig(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { configKey, configValue } = req.body;
        const updateData = {};
        if (configKey !== undefined) updateData.configKey = configKey;
        if (configValue !== undefined) updateData.configValue = configValue;
        const config = await prisma.siteConfiguration.update({ where: { id }, data: updateData });
        await logActivity(req.admin.name, 'changed', 'Site Configuration', config.configKey);
        res.json(config);
    } catch (error) { next(error); }
}

async function deleteConfig(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const config = await prisma.siteConfiguration.findUnique({ where: { id } });
        if (!config) return res.status(404).json({ error: 'Config not found.' });
        await prisma.siteConfiguration.delete({ where: { id } });
        await logActivity(req.admin.name, 'deleted', 'Site Configuration', config.configKey);
        res.json({ message: 'Configuration deleted.' });
    } catch (error) { next(error); }
}

module.exports = { getAllConfigs, createConfig, updateConfig, deleteConfig };
