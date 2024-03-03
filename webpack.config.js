const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: './src/index.js', // default entry path
  output: {
    filename: 'bundle.js', // modified from 'main.js'
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist'
  }
}