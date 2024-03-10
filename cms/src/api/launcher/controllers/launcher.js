'use strict';

/**
 * launcher controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::launcher.launcher');
