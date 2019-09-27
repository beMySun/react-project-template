const path = require('path')
const webpack = require('webpack')
const ShakePlugin = require('webpack-common-shake').Plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')

const { NODE_ENV } = process.env

const plugins = [
  new CleanWebpackPlugin(),
  new ShakePlugin(),
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 10,
    minChunkSize: 10000,
  })
]
const smp = new SpeedMeasurePlugin()

const production = {
  stats: {
    entrypoints: false,
    children: false,
  },
  resolve: {
    mainFields: ['module', 'main', 'browser'],
    alias: {
      root: path.resolve(__dirname),
    },
    extensions: ['.js', '.tsx', '.ts', '.jsx', '.json'],
  },
  mode: NODE_ENV,
  devtool: false,
  plugins,
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules/,
          enforce: true,
          priority: 5,
        },
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          priority: 10,
        },
        antdIcons: {
          test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
          priority: 15,
        },
        styles: {
          test: /\.(css|scss)$/,
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
          priority: 20,
        },
      },
    },
  },
}
module.exports = smp.wrap(merge(base, production))
