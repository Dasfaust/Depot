'use strict';

/**
 * launcher service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::launcher.launcher');
