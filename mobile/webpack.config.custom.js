// Custom webpack config to fix React DevTools source map warnings
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules\/react-devtools-core/,
        ],
      },
      // Disable source maps for react-devtools-core
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        include: [/node_modules\/react-devtools-core/],
        enforce: 'pre',
        options: {
          filterSourceMappingUrl: (url, resourcePath) => {
            if (/react-devtools-core/.test(resourcePath)) {
              return false;
            }
            return true;
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
    },
  },
};