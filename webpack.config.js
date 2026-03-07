const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./audio-visuals/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: '/',
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ['.audio-visuals/index.html'],
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./audio-visuals/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './audio-visuals/audio',
          to: 'audio',
        },
        {
          from: './audio-visuals/fonts',
          to: 'fonts',
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)/i,
        type: "asset/resource",
      },
    ],
  },
};