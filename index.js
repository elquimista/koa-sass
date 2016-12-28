'use strict';

const path                    = require('path');
const fs                      = require('fs-extra');
const sass                    = require('node-sass');
const nodeSassGlobImporter    = require('node-sass-glob-importer');
const mount                   = require('koa-mount');
const serveStatic             = require('koa-static');

module.exports = ({ mountAt, src, dest, importPaths = [] }) => {
  mountAt = mountAt.substr(-1) === '/' ? mountAt.slice(0, -1) : mountAt;

  if (fs.existsSync(dest) === false) {
    fs.mkdirsSync(dest);
  }

  return (ctx, next) => {
    const subPath = path.parse(ctx.path.slice(mountAt.length));
    const srcFile = path.join(src, subPath.dir, subPath.name + '.scss');

    if (fs.existsSync(srcFile) === false || subPath.ext !== '.css') {
      return next();
    }

    const destFile = path.join(dest, subPath.dir, subPath.base);
    const result = sass.renderSync({
      file: srcFile,
      importer: nodeSassGlobImporter(),
      includePaths: importPaths
    });

    fs.writeFileSync(destFile, result.css);
    return mount(mountAt, serveStatic(dest))(ctx, next);
  };
}
