'use strict';

/**
 * launcher-version router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::launcher-version.launcher-version');
