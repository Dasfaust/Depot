'use strict';

/**
 * modpack router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::modpack.modpack');
