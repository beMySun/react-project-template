const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const { NODE_ENV } = process.env;

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../template.html'),
    title: 'Hello Project',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }),
  new FriendlyErrorsWebpackPlugin({}),
  new MiniCssExtractPlugin({
    filename: 'chunk.[name].[contenthash:8].css'
  }),
  new OptimizeCssAssetsWebpackPlugin({
    cssProcessPluginOptions: {
      preset: ['default', { discardComments: { removeAll: true } }]
    }
  }),
  new CopyPlugin([{ from: path.resolve(__dirname, '../src/public'), to: '../dist/public' }]),
  new HappyPack({
    id: 'babel',
    loaders: ['cache-loader', 'babel-loader?cacheDirectory'],
    threadPool: happyThreadPool
  }),
  new HappyPack({
    id: 'tsloader',
    loaders: ['cache-loader', 'ts-loader'],
    threadPool: happyThreadPool
  })
];
const entry = ['@babel/polyfill'];
module.exports = {
  entry,
  resolve: {
    mainFields: ['module', 'main', 'browser'],
    alias: {
      root: path.resolve(__dirname, '../')
    },
    extensions: ['.js', '.tsx', '.ts', '.jsx', '.json']
  },
  output: {
    filename: 'main.[hash:8].js',
    path: path.resolve(__dirname, '../dist/static'),
    chunkFilename: 'chunk.[name].[contenthash:8].js',
    publicPath: '/'
  },
  mode: NODE_ENV,
  devtool: false,
  plugins,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=babel'
      },
      {
        test: /\.(tsx|ts)?$/,
        loader: 'happypack/loader?id=tsloader'
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|bmp|svg|png|webp|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:8].[ext]'
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-gifsicle')({
                  interlaced: false
                }),
                require('imagemin-mozjpeg')({
                  progressive: true,
                  arithmetic: false
                }),
                require('imagemin-pngquant')({
                  floyd: 0.5,
                  speed: 2
                }),
                require('imagemin-svgo')({
                  plugins: [{ removeTitle: true }, { convertPathData: false }]
                })
              ]
            }
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};
