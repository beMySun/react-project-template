const plugins = [
  'lodash',
  '@babel/plugin-syntax-dynamic-import',
  [
    '@babel/plugin-proposal-decorators',
    {
      legacy: true,
    }
  ],
  ['@babel/plugin-proposal-class-properties', { loose: true }]
]

module.exports = (api) => {
  api.cache(true)
  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins,
  }
}
