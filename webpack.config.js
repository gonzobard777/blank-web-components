const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcDirPath = path.resolve(__dirname, 'src');
const distDirPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.join(srcDirPath, 'index.ts'),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less/,
        loader: ['css-loader', 'less-loader'],
      },
      {
        test: /\.(ico|png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10, // при 10000 инлайнит шрифты в base64
              name: `[name].[ext]`, // [path][name].[hash].[ext]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: distDirPath
  },
  devServer: {
    contentBase: distDirPath,
    historyApiFallback: {
      rewrites: [
        {from: /.*/, to: `/index.html`},
      ]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(srcDirPath, 'index.html')
    })
  ]
};
