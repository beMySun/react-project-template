const webpack = require('webpack')
const merge = require('webpack-merge')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const base = require('./webpack.base.config')

const { NODE_ENV } = process.env

const plugins = [new webpack.SourceMapDevToolPlugin({})]

const entry = ['react-hot-loader/patch']

const smp = new SpeedMeasurePlugin()

const dev = {
  entry,
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  mode: NODE_ENV,
  devtool: false,
  plugins,
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8181,
    quiet: true,
    open: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
}
module.exports = smp.wrap(merge(base, dev))
