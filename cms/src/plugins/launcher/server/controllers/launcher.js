"use strict";

module.exports = {
  async versionTable(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").versionTable(ctx.query);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async latest(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").latest(ctx.query);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async packages(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").packages(ctx.query);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async packageManifest(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").packageManifest(ctx.params.name, ctx.params.version);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async domain(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").domain(ctx.params.name);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async create(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").create(ctx.request.body);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async delete(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").delete(ctx.params.id);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async news(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").news(ctx.query);
    } catch(e) {
      ctx.throw(500, e)
    }
  },

  async packageNews(ctx) {
    try {
      return await strapi.plugin("launcher").service("launcher").packageNews(ctx.params.id);
    } catch(e) {
      ctx.throw(500, e)
    }
  },
};