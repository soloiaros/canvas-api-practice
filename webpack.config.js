const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./audio-visuals/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: '',
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ['.audio-visuals/index.html'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./audio-visuals/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|gif|jper)$/i,
        type: "asset/resource",
      },
      {
        test: /\.mp3$/i,
        type: "asset",
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)/i,
        type: "asset/resource",
      },
    ],
  },
};