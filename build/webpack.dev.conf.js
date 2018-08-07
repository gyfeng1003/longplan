'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const fs = require('fs')

// const newData = require('../mock/newData.json')
// const realData = require('../mock/realData.json')
// const devicelist = require('../mock/devicelist.js')
// const scenelist = require('../mock/scenelist.json')
// const rooms = require('../mock/getRooms.js')
// const enScene = require('../mock/enSceneS.js')
// const enRoom = require('../mock/enRoom.js')
// const enDevive = require('../mock/enDevices.js')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
	before(app){

		// app.get('/datas/getAllDataOld', (req, res) => {
		// 	res.json(realData)
		// })
		// app.get('/datas/getAllDataNewest', (req, res) => {
		// 	res.json(newData)
		// })
		// app.get('/device/getDeviceListNoScence', (req, res) => {
		// 	res.json(devicelist)
		// })
		// app.get('/device/getSceneList', (req, res) => {
		// 	res.json(scenelist)
		// })
		// app.get('/datas/getRoomList', (req, res) => {
		// 	res.json(rooms)
		// })
		// app.get('/device/getEnglishEditionSceneName', (req, res)=>{
		// 	res.json(enScene)
		// })
		// app.get('/device/getEnglishEditionRoomName', (req, res)=>{
		// 	res.json(enRoom)
		// })
		// app.get('/device/getEnglishEditionDeviceNameGroupByRoom', (req, res)=>{
		// 	res.json(enDevive)
		// })

		// var mockDir = path.resolve(__dirname, '../mock');
		// (function setMock(mockDir) {
		// 	fs.readdirSync(mockDir).forEach(function (file) {
		// 		var filePath = path.resolve(mockDir, file);
		// 		if(fs.statSync(filePath).isDirectory()){
		// 			setMock(filePath);
		// 		}else{
		// 			var mockData = require(filePath);
		// 			app.get(mockData.api, mockData.response);
		// 		}
		// 	})
		// })(mockDir)
	}
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
