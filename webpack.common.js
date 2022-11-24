const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
      "background": path.resolve(__dirname, "src/background.ts"),
      "options": path.resolve(__dirname, "src/options.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: './manifest.json', to: '../dist/manifest.json'},
        {from: './LICENSE', to: '../dist/LICENSE'},
        {from: './icons', to: '../dist/icons'},
      ],
    }),
    new HtmlWebpackPlugin({
        template: "src/options.html",
    }),
  ],
};
