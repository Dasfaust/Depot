'use strict';

/**
 * launcher-version service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::launcher-version.launcher-version');
