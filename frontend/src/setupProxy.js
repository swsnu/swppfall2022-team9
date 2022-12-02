// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require("http-proxy-middleware");

const isDevMode = process.env.NODE_ENV === "development";

//this only works for localhost
module.exports = function (app) {
  if (isDevMode) {
    return;
  }
  // proxy the request to real server
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://127.0.0.1:8000/api",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    }),
  );
};
