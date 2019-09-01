const HtmlWebPackPlugin = require('html-webpack-plugin');

const sourceMapLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  enforce: 'pre',
  loader: 'source-map-loader',
};
const babelLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/transform-runtime',
      ['styled-components', { ssr: true }],
    ],
  },
};
const htmlLoader = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
      options: { minimize: true },
    },
  ],
};

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [sourceMapLoader, babelLoader, htmlLoader],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './tools/template/index.html',
      filename: './index.html',
    }),
  ],
};
