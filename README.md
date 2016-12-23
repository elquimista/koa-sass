## koa.sass

Koa@2 middleware for processing sass files, integrated with [koa-mount](https://github.com/koajs/mount) and [koa-static](https://github.com/koajs/static).

### Install

```
npm i --save koa.sass
```

### Usage Example

```javascript
const Koa = require('koa');
const serveSass = require('koa.sass');
const mount = require('koa-mount');
const serveStatic = require('koa-static');

const app = new Koa();

app.use(serveSass({
  mountAt: '/assets',
  src: './app/assets/stylesheets',
  dest: './.tmp/stylesheets'
});
app.use(mount('/assets', serveStatic('./node_modules')));
app.use(mount('/assets', serveStatic('./app/assets/javascripts')));

app.listen(3000);
```

### License

MIT
