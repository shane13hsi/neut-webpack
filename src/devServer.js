var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var ip = require('ip');
var ipAddress = ip.address();
var defaultSpec = require('./defaultSpec');

module.exports = function (config) {
  return function () {
    var compiler = webpack(config);
    var bundleStart = undefined;

    compiler.plugin('compile', function () {
      console.log('Bundling...');
      bundleStart = Date.now();
    });

    compiler.plugin('done', function () {
      console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    var bundler = new WebpackDevServer(compiler, {
      hot: true,
      publicPath: config.output.publicPath,
      quiet: false,
      noInfo: true,
      stats: {
        colors: true
      }
    });

    bundler.listen(defaultSpec.webpackDevServerPort, "0.0.0.0", function (err) {
      if (err) {
        console.log(err);
      }
      console.log('Webpack dev server is Listening at ' + ipAddress + ':' + defaultSpec.webpackDevServerPort);
    });
  };
};
