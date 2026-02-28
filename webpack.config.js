import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";

export default {
  mode: "development",
  entry: "./audio-visuals/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './audio-visuals/index.html',
    })
  ],
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./audio-visuals/index.html"],
  },
};