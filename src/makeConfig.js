var defaultSpec = require('./defaultSpec');
var webpack = require('webpack');
var ip = require('ip');
var ipAddress = ip.address();
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');

module.exports = function (spec) {
  var finalSpec = _.assign(defaultSpec, spec);
  return {
    devtool: finalSpec.dev ? 'eval' : undefined,

    entry: function () {
      if (finalSpec.dev) {
        return [
          'webpack-dev-server/client?http://' + ipAddress + ':' + finalSpec.devServerPort,
          'webpack/hot/only-dev-server',
          finalSpec.entryFileName
        ];
      } else {
        return [finalSpec.entryFileName];
      }
    },

    module: function () {
      var loaders = [
        { test: /\.(scss|sass)$/, loader: 'style!css!sass' },
        { test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000' }
      ];

      if (finalSpec.dev) {
        loaders.push({ test: /\.jsx?$/, include: finalSpec.srcDir, loaders: ['react-hot', 'babel-loader'] });
      } else {
        loaders.push({ test: /\.jsx?$/, include: finalSpec.srcDir, loaders: ['babel-loader'] });
      }
      return loaders;
    },

    output: function () {
      if (finalSpec.dev) {
        return {
          path: '/build/',
          filename: finalSpec.outputFileName,
          publicPath: '/build/'
        };
      } else {
        return {
          path: '/dist',
          filename: finalSpec.outputFileName
        };
      }
    },

    plugins: function () {
      if (finalSpec.dev) {
        return [
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('development')
            },
            __REDUX_LOGGER__: finalSpec.reduxLogger
          }),
          new NyanProgressPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ];
      } else {
        return [
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production')
            }
          }),
          new NyanProgressPlugin(),
          new webpack.optimize.DedupePlugin(),  // 去重
          new webpack.optimize.OccurenceOrderPlugin(),  // 使用频繁的 modules ，分配的 id 更短。也同时保证了 moduels 顺序的一直
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            },
            output: {
              comments: false
            },
            sourceMap: false
          })
        ];
      }
    },

    resolve: {
      extensions: ['', '.js', '.jsx', '.json']
    }
  };
};
