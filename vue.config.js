module.exports = {
  // 是否在保存的时候检查
  lintOnSave: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: undefined,
  css: {
    loaderOptions: {}
  },

  devServer: {
    // 环境配置
    // host: '192.168.11.136',
    host: 'localhost',
    port: 6688,
    open: true, //配置自动启动浏览器
  },
};


