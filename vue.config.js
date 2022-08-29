const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const fs = require("fs");
var webpack = require("webpack");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;
module.exports = defineConfig({
  lintOnSave: "warning",
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
    ],
  },
  transpileDependencies: ["vuetify"],
  devServer: { allowedHosts: "all" },
  publicPath: process.env.VUE_APP_ACONDBW_PUBLIC_PATH,
});

// https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c
