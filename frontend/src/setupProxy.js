const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/plugins',
    createProxyMiddleware({
      target: 'http://localhost:4466',
      changeOrigin: true,
    })
  );
};
