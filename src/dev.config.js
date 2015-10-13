var defaultSpec = require('./defaultSpec');
var webpack = require('webpack');
var ip = require('ip');
var ipAddress = ip.address();
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');
var _assign = require('lodash/object/assign');
var path = require('path');

module.exports = function(spec) {
  var finalSpec = _assign(defaultSpec, spec);

  return {
    cache: true,
    debug: true,
    devtool: 'eval',

    entry: [
      'webpack-dev-server/client?http://' + ipAddress + ':' + finalSpec.webpackDevServerPort,
      'webpack/hot/only-dev-server',
      path.join(finalSpec.srcDir, finalSpec.entryFileName)
    ],

    module: {
      loaders: [
        { test: /\.css$/, loader: 'style!css' },
        { test: /\.less$/, loader: 'style!css!less' },
        { test: /\.(scss|sass)$/, loader: 'style!css!sass' },
        { test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000' },
        { test: /\.jsx?$/, include: finalSpec.srcDir, loaders: ['react-hot', 'babel-loader'] }
      ]
    },

    output: {
      path: '/build/',
      filename: finalSpec.outputFileName,
      publicPath: '/build/'
    },

    plugins: [
      new webpack.DefinePlugin({
        __REDUX_LOGGER__: finalSpec.reduxLogger
      }),
      new NyanProgressPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
      extensions: ['', '.js', '.jsx', '.json']
    }
  };
};
