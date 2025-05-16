module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-react",
      [
        "@babel/preset-typescript",
        { allowDeclareFields: true, onlyRemoveTypeImports: true },
      ],
      [
        "@babel/preset-env",
        {
          loose: true,
          shippedProposals: true,
        },
      ],
    ],
    plugins: [
      "react-native-reanimated/plugin",
      "@babel/plugin-transform-export-namespace-from",
      "@babel/plugin-transform-class-properties",
      "@babel/plugin-transform-runtime",
    ],
    overrides: [
      {
        test: /node_modules\/expo/,
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { node: "current" },
              loose: true,
              shippedProposals: true,
            },
          ],
          "@babel/preset-typescript",
        ],
      },
    ],
  };
};
