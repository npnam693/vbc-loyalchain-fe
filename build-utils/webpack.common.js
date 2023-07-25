const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const WebpackBar = require("webpackbar");

module.exports = {
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  entry: {
    main: ["@babel/polyfill", "./src/index.tsx"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true } },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".json", ".tsx", ".ts"],
    fallback: { crypto: false, stream: false },
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    chunkFilename: "./assets/chunks/[name].chunk.js",
  },
  performance: {
    hints: false,
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "LoyalChain",
      template: path.resolve(__dirname, "./index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "style.min.css",
      ignoreOrder: true,
    }),
    // new webpack.ProvidePlugin({
    //   Buffer: ["buffer", "Buffer"],
    // }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    historyApiFallback: true,
    hot: true,
    port: 3001,
    client: {
      logging: "none",
    },
    // host: "192.168.123.123",
    // host: '192.168.1.5'
  },
  infrastructureLogging: { level: "error" },
  stats: "minimal",
};
