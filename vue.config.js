module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://hn216.api.yesapi.cn',
        ws: true,
        changeOrigin: true
      }
    }
  }
}