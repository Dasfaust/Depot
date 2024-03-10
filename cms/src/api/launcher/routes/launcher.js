'use strict';

/**
 * launcher router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::launcher.launcher');
