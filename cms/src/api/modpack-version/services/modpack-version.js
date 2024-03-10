'use strict';

/**
 * modpack-version service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::modpack-version.modpack-version');
