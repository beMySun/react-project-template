const devConfig = require('./config/webpack.dev.config.js')
const prodConfig = require('./config/webpack.prod.config')

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig
