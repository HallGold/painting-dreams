/*
 * @Description:
 * @Author: Author
 * @Date: 2022-05-20 09:32:48
 * @LastEditTime: 2022-08-15 13:58:30
 * @LastEditors: chenzhuomin 1575253121@qq.com
 */
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    port: 8081, // 本机端口号
    host: 'localhost', // 本机主机名
    https: false, // 协议
    open: false, // 启动服务器时自动打开浏览器访问
    proxy: {
      '/api': {
        target: 'http://zbhmapi.acgart.com/api',
        changOrigin: true, // 开启代理
        pathRewrite: {
          '^/api': ''
        }
      },
      '/sys': {
        target: 'http://zbhmapi.acgart.com/api',
        changOrigin: true, // 开启代理
        pathRewrite: {
          '^/sys': ''
        }
      }
    }
  }
}
