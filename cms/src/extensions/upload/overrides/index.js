// https://github.com/strapi/strapi/issues/3622

const path = require("path");
const { extension } = require("mime-types");
const { file: { bytesToKbytes } } = require('@strapi/utils');

module.exports = {
  async formatFileInfoOverride({ filename, type, size }, fileInfo = {}, metas = {}) {
    const fileService = strapi.plugin("upload").service("file");

    let ext = path.extname(filename);
    if (!ext) {
      ext = `.${extension(type)}`;
    }
    const usedName = (fileInfo.name || filename).normalize();
    const basename = path.basename(usedName, ext);

    const entity = {
      name: usedName,
      alternativeText: fileInfo.alternativeText,
      caption: fileInfo.caption,
      folder: fileInfo.folder,
      folderPath: await fileService.getFolderPath(fileInfo.folder),
      hash: basename,
      ext,
      mime: type,
      size: bytesToKbytes(size),
      sizeInBytes: size,
    };

    const { refId, ref, field } = metas;

    if (refId && ref && field) {
      entity.related = [
        {
            id: refId,
            __type: ref,
            __pivot: { field },
        },
      ];
    }

    if (metas.path) {
      entity.path = metas.path;
    }

    if (metas.tmpWorkingDirectory) {
      entity.tmpWorkingDirectory = metas.tmpWorkingDirectory;
    }

    return entity;
  }
};