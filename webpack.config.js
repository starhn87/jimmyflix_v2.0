const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    home: ['./src/pages/Home.tsx'],
    tv: ['./src/pages/TV.tsx'],
    trending: ['./src/pages/Trending.tsx'],
    search: ['./src/pages/Search.tsx'],
    detail: ['./src/pages/Detail.tsx'],
  },
  optimization: {
    splitChunks: {
      // 중복되는 코드를 제거
      chunks: 'all',
    },
    minimize: true,
    minimizer: mode === 'production' ? [new OptimizeCSSAssetsPlugin()] : [],
  },
  output: {
    clean: true,
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource',
      },
    ],
  },
}
