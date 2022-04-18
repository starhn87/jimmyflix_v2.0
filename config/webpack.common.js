const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

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
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
              publicPath: '/dist/',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '/dist/',
              name: 'images/[name].[ext]',
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/favicon.ico',
    }),
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
