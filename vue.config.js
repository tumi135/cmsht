module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.it120.cc',
        ws: true,
        changeOrigin: true
      }
    }
  }
}