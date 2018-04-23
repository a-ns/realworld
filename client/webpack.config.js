const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    new CleanWebpackPlugin("build"),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, "public"), to: "." }
    ])
  ],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  },
  devServer: {
    historyApiFallback: true
  }
};
