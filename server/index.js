const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
const { createProxyMiddleware } = require("http-proxy-middleware");
app.use(
  "/products.json",
  createProxyMiddleware({
    target: "https://jkyoggiftshop.myshopify.com/admin/api/2023-01", //original url
    changeOrigin: true,
  })
);

app.use(
  "/products/count.json",
  createProxyMiddleware({
    target: "https://jkyoggiftshop.myshopify.com/admin/api/2023-01", //original url
    changeOrigin: true,
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
  })
)

app.listen(5000);
