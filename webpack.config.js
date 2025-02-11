"use strict";

import path from "path";
import webpack from "webpack"; //to access built-in plugins
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let exports = {
  mode: "development",
  context: __dirname,
  entry: "./src/index.ts",
  module: {
    rules: [
      { test: /\.css$/, use: "raw-loader" },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", "..."],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.HOST": JSON.stringify(process.env.HOST),
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, ""),
    },
    hot: true,
    open: false,
    compress: true,
    historyApiFallback: true,
    allowedHosts: ["jstris.jezevec10.com"],
    client: {
      webSocketURL: "ws://localhost:8080/ws",
    },
  },
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js",
  },
  optimization: {
    minimize: false,
  },
};

if (process.env.NODE_ENV === "development") {
  //module.exports.devtool = 'cheap-module-eval-source-map';
  exports.devtool = "eval-cheap-module-source-map";
}

export default exports;
