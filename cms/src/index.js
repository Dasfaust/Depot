'use strict';

module.exports =
{
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    /**
     * Override the default upload info formatter with custom function.
     */
    strapi.services["plugin::upload.upload"].formatFileInfo = require("./extensions/upload/overrides").formatFileInfoOverride;
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
