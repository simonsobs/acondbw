const fs = require("fs");
var webpack = require('webpack');
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
    ],
  },
  transpileDependencies: ["vuetify"],
  devServer: {
    disableHostCheck: true,
  },
  publicPath: process.env.VUE_APP_ACONDBW_PUBLIC_PATH,
};

// https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c
