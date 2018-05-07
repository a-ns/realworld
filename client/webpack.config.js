const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  devtool: "cheap-module-source-map",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin("build"),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "public/index.html")
    }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      template: path.resolve(__dirname, "public/index.html")
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(eot|woff|ttf)$/, use: ["file-loader"] }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};
