const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const FAVICON = './src/assets/logo/logo_favicon.png';

module.exports = (env = {}) => ({
  entry: {
    index: './src/pages/home.tsx',
    playground: './src/pages/playground.tsx',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
  },
  output: {
    filename: '[name].bundle.js'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {test: /\.tsx?$/, use: 'ts-loader'},
      {
        // loader for CSS from libraries (node_modules)
        test: /\.css$/,
        include: path.resolve(__dirname, 'node_modules'),
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
        ]
      },
      {
        // CSS modules for this app
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: 'ramp-[name]__[local]--[hash:base64:5]',
              }
            }
          },
        ]
      },
      {
        // generate .d.ts files for CSS modules
        enforce: 'pre',
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'typed-css-modules-loader',
            options: {
              noEmit: true,
            }
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name]-[hash].[ext]',
          },
        },
      },
      {
        test: /\.ttl$/,
        use: {loader: 'raw-loader'}
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RAMP shapes - Home',
      chunks: ['index'],
      template: 'src/pages/template.ejs',
      favicon: FAVICON,
      filename: 'index.html',
      env,
    }),
    new HtmlWebpackPlugin({
      title: 'RAMP shapes - Playground',
      chunks: ['playground'],
      template: 'src/pages/template.ejs',
      favicon: FAVICON,
      filename: 'playground.html',
      env,
    }),
  ],
  performance: {
    maxEntrypointSize: 5 * 1024 * 1024,
    maxAssetSize: 5 * 1024 * 1024,
  }
});
