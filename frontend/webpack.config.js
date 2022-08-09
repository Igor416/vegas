import { resolve } from 'path';
import { DefinePlugin } from 'webpack';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
const smp = new SpeedMeasurePlugin();

export default smp.wrap({
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, './static/frontend'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
});
