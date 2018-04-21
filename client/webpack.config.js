const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname,  'build')
    },
    plugins: [
        new CopyWebpackPlugin([{from: path.resolve(__dirname, 'public'), to: ''}])
    ],
    module: {
        rules: [
            { test: /\.js$/, exclude : /node_modules/, loader: "babel-loader"}
        ]
    }
}