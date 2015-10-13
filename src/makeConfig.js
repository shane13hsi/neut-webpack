var defaultSpec = require('./defaultSpec');
var webpack = require('webpack');
var ip = require('ip');
var ipAddress = ip.address();
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');
var _assign = require('lodash/object/assign');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(spec) {
  var finalSpec = _assign(defaultSpec, spec);

  return {
    cache: finalSpec.dev,
    debug: finalSpec.dev,
    devtool: finalSpec.dev ? 'eval' : false,

    entry: (function() {
      if (finalSpec.dev) {
        return [
          'webpack-dev-server/client?http://' + ipAddress + ':' + finalSpec.webpackDevServerPort,
          'webpack/hot/only-dev-server',
          path.join(finalSpec.srcDir, finalSpec.entryFileName)
        ];
      } else {
        return [
          path.join(finalSpec.srcDir, finalSpec.entryFileName)
        ];
      }
    })(),

    module: {
      loaders: (function() {
        if (finalSpec.dev) {
          return [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.(scss|sass)$/, loader: 'style!css!sass' },
            { test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000' },
            { test: /\.jsx?$/, include: finalSpec.srcDir, loaders: ['react-hot', 'babel-loader'] }
          ];
        } else {
          return [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css!less") },
            { test: /\.(scss|sass)$/, loader: ExtractTextPlugin.extract("style-loader", "css!sass") },
            { test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000' },
            { test: /\.jsx?$/, include: finalSpec.srcDir, loader: 'babel-loader' }
          ]
        }
      })()
    },

    output: (function() {
      if (finalSpec.dev) {
        return {
          path: '/build',
          filename: finalSpec.outputFileName,
          publicPath: '/build'
        };
      } else {
        return {
          path: finalSpec.distDir,
          filename: finalSpec.outputFileName
        };
      }
    })(),

    plugins: (function() {
      if (finalSpec.dev) {
        return [
          new webpack.DefinePlugin({
            __REDUX_LOGGER__: finalSpec.reduxLogger
          }),
          new NyanProgressPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ];
      }
      if (process.env.NODE_ENV === 'production') {
        return [
          new webpack.DefinePlugin({
            __REACT_DEVTOOLS_GLOBAL_HOOK__: false
          }),
          new ExtractTextPlugin("style.css"),
          new NyanProgressPlugin(),
          new webpack.optimize.DedupePlugin(),  // 去重
          new webpack.optimize.OccurenceOrderPlugin(),  // 使用频繁的 modules ，分配的 id 更短。也同时保证了 moduels 顺序的一直
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              keep_fnames: true,
              warnings: false
            },
            output: {
              comments: false
            },
            mangle: {
              keep_fnames: true
            }
          })
        ];
      }
      return [
        new webpack.DefinePlugin({
          __REDUX_LOGGER__: finalSpec.reduxLogger
        }),
        new NyanProgressPlugin()
      ];
    })(),

    resolve: {
      extensions: ['', '.js', '.jsx', '.json']
    }
  };
};
