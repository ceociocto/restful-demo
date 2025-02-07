const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: isDevelopment ? './src/dev.tsx' : './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      ...(isDevelopment ? [] : [
        new ModuleFederationPlugin({
          name: 'pensionWithdrawal',
          filename: 'remoteEntry.js',
          exposes: {
            './PensionFlow': './src/components/PensionWithdrawalFlow',
          },
          shared: {
            react: { singleton: true, requiredVersion: '^18.2.0' },
            'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
            '@mui/material': { singleton: true, requiredVersion: '^5.13.0' },
          },
        }),
      ]),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
    devServer: {
      port: 3001,
      historyApiFallback: true,
      hot: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
        },
      },
    },
  };
}; 