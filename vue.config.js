var webpack = require("webpack");
module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "/api": {
        target: "http://hn216.api.yesapi.cn",
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js"
      })
    ]
  }
};
