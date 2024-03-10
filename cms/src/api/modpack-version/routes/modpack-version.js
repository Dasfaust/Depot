'use strict';

/**
 * modpack-version router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::modpack-version.modpack-version');
