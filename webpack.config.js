const path = require("path");
require("source-map-support").install();
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function (options) {
  return {
    ...options,
    entry: "./src/handler.ts",
    mode: "production",
    target: "node22",
    output: {
      ...options.output,
      filename: "handler.js",
      libraryTarget: "commonjs",
      path: path.join(__dirname, "dist"),
    },
    optimization: {
      minimize: true,
      splitChunks: false,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          parallel: 2,
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    },
    externals: [],
    plugins: [...options.plugins],
  };
};
