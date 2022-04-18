const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: `${path.resolve(__dirname, '../src')}/index.tsx`,
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   filename: './index.html',
    //   favicon: './public/favicon.ico',
    // }),
    new webpack.ProvidePlugin({ React: 'react', process: 'process/browser' }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_KEY': JSON.stringify(
        process.env.REACT_APP_API_KEY,
      ),
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, '..src/') },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
}
