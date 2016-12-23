'use strict';

const path        = require('path');
const fs          = require('fs-extra');
const sass        = require('node-sass');
const mount       = require('koa-mount');
const serveStatic = require('koa-static');

module.exports = ({ mountAt, src, dest }) => {
  mountAt = mountAt.substr(-1) === '/' ? mountAt.slice(0, -1) : mountAt;

  if (fs.existsSync(dest) === false) {
    fs.mkdirsSync(dest);
  }

  return (ctx, next) => {
    const subPath = path.parse(ctx.path.slice(mountAt.length));
    if (subPath.ext !== '.css') {
      throw new Error(`Invalid stylesheet resource type. Currently css is the only one being supported`);
    }
    const srcFile = path.join(src, subPath.dir, subPath.name + '.scss');
    const destFile = path.join(dest, subPath.dir, subPath.base);
    const result = sass.renderSync({
      file: srcFile
    });

    fs.writeFileSync(destFile, result.css);
    return mount(mountAt, serveStatic(dest))(ctx, next);
  };
}
