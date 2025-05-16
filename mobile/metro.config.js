// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Expo 49 enables the JS engine by default (V8)
  // Some libraries may have issues with this.
  // If you have issues with debugging, uncomment the following line:
  // config.transformer.asyncRequireModulePath = require.resolve('metro-runtime/src/modules/asyncRequire');
  config.transformer = {
    ...transformer,
    babelTransformerPath: path.resolve(
      __dirname,
      "./src/utils/svgTransformer.js"
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    extraNodeModules: {
      // Add any needed module aliases for native development here
    },
  };

  return config;
})();
