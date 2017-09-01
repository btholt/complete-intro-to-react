const path = require('path');

module.exports = {
  context: __dirname, //means we're running webpack from the root directory
  entry: './js/ClientApp.jsx',
  devtool: 'cheap-eval-source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  devServer: {
    publicPath: '/public/',
    historyApiFallback: true //the client will worry about the routing, i will not
  },
  module: {
    rules: [
      {
        enforce: 'pre', //this will run linting in the webpack.
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  }
};
