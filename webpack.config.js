var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    library: "index",
    libraryTarget: "commonjs2",
    filename: "index.js"
  },
  target: "node",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.json$/,
        loader: "json"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "Promise": "bluebird"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      minimize: true
    })
  ]
};
