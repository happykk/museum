var path = require('path')
var utils = require('./utils')
var config = require('../config')
var entry = {
	app: './src/main.ts'
}

if(process.env.NODE_ENV === 'development'){
	entry.mock = './mock/index.js';
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: entry,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    },
    module: {
      noParse: function(content) {
        return /jquery|lodash/.test(content)
      }
    }
}
