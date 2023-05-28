const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../static/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
};