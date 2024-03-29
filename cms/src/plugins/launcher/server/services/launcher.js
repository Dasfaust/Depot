'use strict';

const axios = require("axios");
const { errors } = require('@strapi/utils');
const { NotFoundError } = errors;

axios.defaults.timeout = 5000;

module.exports = ({ strapi }) => ({
  async versionTable(query) {
    var modpackQuery = await strapi.entityService.findMany("api::modpack.modpack", {
      populate: { versions: { populate: { modpack: { fields: ["name", "title"] } }, sort: ["id:desc"] } }
    });

    var versionList = {};
    modpackQuery.map((pack) => {
      versionList[pack.name] = [];

      if (pack.versions.length > 0) {
        versionList[pack.name].push(pack.versions[0]);
        // also expose non-preview versions if they exist, and if the pack isn't in preview itself
        if (pack.versions[0].isPreview && !pack.isPreview) {
          for (var i = 1; i < pack.versions.length; i++) {
            if (!pack.versions[i].isPreview) {
              versionList[pack.name].push(pack.versions[i]);
              break;
            }
          }
        }
      }
    });

    return versionList;
  },

  async latest(query) {
    var wantsPreview = (("key" in query && query.key.toLowerCase() == "preview") ? true : false);

    var launcherVersionQuery = {
      sort: ["id:desc"],
      pagination: { limit: 1 },
      populate: { artifact: { fields: ["url"] } }
    }

    if (!wantsPreview) {
      launcherVersionQuery.filters = { isPreview: { $eq: false } }
    }

    var result = await strapi.entityService.findMany("api::launcher-version.launcher-version", launcherVersionQuery);

    return { version: result[0].version, url: process.env.BASE_URL + result[0].artifact.url };
  },

  async packages(query) {
    var result = await strapi.entityService.findMany("api::launcher.launcher", {
      fields: ["minimumVersion"]
    });

    var wantsPreview = (("key" in query && query.key.toLowerCase() == "preview") ? true : false);

    var modpackQuery = {
      fields: ["name", "title", "priority", "isPreview"],
      populate: { icon: {}, domain: {}, versions: { fields: ["version", "isPreview"], sort: ["id:desc"] } }
    }

    if (!wantsPreview) {
      var previewFilter = { isPreview: { $eq: false } }
      modpackQuery.filters = previewFilter;
      modpackQuery.populate.versions.filters = previewFilter;
    }

    result.packages = [];
    var instances = await strapi.entityService.findMany("api::modpack.modpack", modpackQuery);
    instances.map((pkg) => {
      if ("versions" in pkg && pkg.versions.length > 0 && !("error" in pkg.versions[0])) {
        pkg.version = pkg.versions[0].version;

        if (pkg.isPreview || pkg.versions[0].isPreview) {
          pkg.version = pkg.version + "-preview";
        }

        pkg.location = `/launcher/packages/${pkg.name}/${pkg.version}`;
        pkg.domainName = pkg.domain.name;
        pkg.newsUrl = `${process.env.NEWS_URL}/${pkg.name}`;
        pkg.iconUrl = process.env.BASE_URL + pkg.icon.url;

        delete pkg.isPreview;
        delete pkg.domain;
        delete pkg.icon;
        delete pkg.isPreview;
        delete pkg.versions;
        delete pkg.id;

        result.packages.push(pkg)
      }
    });

    var domains = await strapi.entityService.findMany("api::domain.domain", {
      filters: { depotUrl: { $ne: process.env.BASE_URL } }
    });

    for (var domain of domains) {
      try {
        var preview = wantsPreview ? "preview" : "";
        var domainResult = await axios.get(`${domain.depotUrl}/launcher/packages?key=${preview}`);
        domainResult.data.packages.map((pkg) => {
          pkg.location = `${domain.depotUrl}${pkg.location}`;
          result.packages.push(pkg);
        });
      } catch (axError) {
        console.log(`Error getting packages from domain ${domain.name}:`);
        console.log(axError);
      }
    }

    if ("id" in result) {
      delete result.id;
    }

    return result;
  },

  async packageManifest(name, version) {
    if (version.includes("-preview")) {
      version = version.replace("-preview", "");
    }

    var result = await strapi.entityService.findMany("api::modpack-version.modpack-version", {
      filters: { $and: [{ modpack: { name: { $eq: name } } }, { version: { $eq: version } }] },
      sort: ["id:desc"],
      pagination: { limit: 1 },
      populate: { modpack: { fields: ["name", "title"] } }
    });

    if (result.length > 0) {
      result[0].title = result[0].modpack.title;
      result[0].name = result[0].modpack.name;

      var launcher = await strapi.entityService.findMany("api::launcher.launcher", {
        fields: ["objectsLocationOverride", "librariesLocationOverride"]
      });

      if (launcher.objectsLocationOverride != null) {
        result[0].objectsLocation = launcher.objectsLocationOverride;
      }
      if (launcher.librariesLocationOverride != null) {
        result[0].librariesLocation = launcher.librariesLocationOverride;
      }

      delete result[0].modpack;
      delete result[0].id;
      delete result[0].createdAt;
      delete result[0].updatedAt;
      delete result[0].publishedAt;
      delete result[0].heapValue;
      delete result[0].isPreview;

      return result[0];
    }

    throw new NotFoundError("No manifest with name '" + name + "' and '" + version + "' found");
  },

  async domain(name) {
    var modpacks = await strapi.entityService.findMany("api::modpack.modpack", {
      filters: { name: { $eq: name } },
      populate: ["domain"]
    });

    if (modpacks.length > 0) {
      return modpacks[0].domain;
    }

    throw new NotFoundError("No modpack with name '" + name + "' found");
  },

  async create(data) {
    var modpack = await strapi.entityService.findMany("api::modpack.modpack", {
      filters: { name: { $eq: data.name } }
    });

    return await strapi.entityService.create("api::modpack-version.modpack-version", {
      data: {
        modpack: modpack[0].id,
        version: data.version,
        gameVersion: data.gameVersion,
        isPreview: data.preview,
        features: data.features,
        tasks: data.tasks,
        versionManifest: data.versionManifest,
        loaders: data.loaders,
        launch: data.launch,
        minimumVersion: data.minimumVersion,
        librariesLocation: data.librariesLocation,
        objectsLocation: data.objectsLocation,
        defaultJVMArguments: data.defaultJVMArguments,
        defaultHeapAllocation: data.defaultHeapAllocation,
        publishedAt: Date.now()
      }
    });
  },

  async delete(id) {
    return await strapi.entityService.delete("api::modpack-version.modpack-version", id);
  },

  async news(query) {
    var result = await strapi.entityService.findMany("api::launcher.launcher", {});

    if (result.length == 0) {
      throw new NotFoundError("A launcher has not yet been configured");
    }

    return result;
  },

  async packageNews(name) {
    var result = await strapi.entityService.findMany("api::modpack.modpack", {
      filters: { name: { $eq: name } },
      pagination: { limit: 1 },
      populate: ["domain"]
    });

    if (result.length == 0) {
      throw new NotFoundError(`No instances by the name of '${name}' found`);
    }

    return result[0];
  }
});