const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
   /* publicPath: path.join(__dirname, 'dist')*/
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|svg)$/,
        use: [
        {
          loader: 'url-loader',
          options: {limit: '40000'}
        }, 
        'image-webpack-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname),
    port: 3000
  },
  devtool: "source-map"
};

module.exports = config;

