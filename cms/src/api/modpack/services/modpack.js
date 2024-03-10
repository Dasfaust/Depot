'use strict';

/**
 * modpack service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::modpack.modpack');
