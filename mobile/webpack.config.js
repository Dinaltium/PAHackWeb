const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published to npm. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, "node_modules/react-native-gesture-handler"),
    path.resolve(__dirname, "node_modules/react-native-reanimated"),
    path.resolve(__dirname, "node_modules/@react-navigation"),
  ],
  use: {
    loader: "babel-loader",
    options: {
      // cacheDirectory: true,
      // presets & plugins as needed
      presets: ["babel-preset-expo"],
      plugins: ["react-native-reanimated/plugin"],
    },
  },
};

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add the babel-loader configuration
  config.module.rules.push(babelLoaderConfiguration);

  // Customize the config before returning it
  if (!config.resolve) {
    config.resolve = {};
  }

  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  // Define module aliases for web builds
  // These map native modules to our web polyfills
  const webPolyfillsPath = path.resolve(__dirname, "src/utils/web-polyfills");

  Object.assign(config.resolve.alias, {
    // Core utilities
    "../Utilities/Platform": path.resolve(webPolyfillsPath, "Platform.js"),
    "../Utilities/BackHandler": path.resolve(webPolyfillsPath, "noop.js"),
    "../../Utilities/Platform": path.resolve(webPolyfillsPath, "Platform.js"),
    "../../../Libraries/Utilities/Platform": path.resolve(
      webPolyfillsPath,
      "Platform.js"
    ),
    "../../../../Libraries/Utilities/Platform": path.resolve(
      webPolyfillsPath,
      "Platform.js"
    ),
    "./Platform": path.resolve(webPolyfillsPath, "Platform.js"),

    // Networking
    "./RCTNetworking": path.resolve(webPolyfillsPath, "RCTNetworking.js"),
    "../Network/RCTNetworking": path.resolve(
      webPolyfillsPath,
      "RCTNetworking.js"
    ),
    "../../Network/RCTNetworking": path.resolve(
      webPolyfillsPath,
      "RCTNetworking.js"
    ),

    // Components
    "../Image/Image": path.resolve(webPolyfillsPath, "Image.js"),
    "../../Image/Image": path.resolve(webPolyfillsPath, "Image.js"),

    // Alert
    "./RCTAlertManager": path.resolve(webPolyfillsPath, "RCTAlertManager.js"),

    // StyleSheet
    "./PlatformColorValueTypes": path.resolve(
      webPolyfillsPath,
      "PlatformColorValueTypes.js"
    ),
    "../../StyleSheet/PlatformColorValueTypes": path.resolve(
      webPolyfillsPath,
      "PlatformColorValueTypes.js"
    ),

    // BaseViewConfig
    "./BaseViewConfig": path.resolve(webPolyfillsPath, "BaseViewConfig.js"),

    // Developer tools
    "../../src/private/debugging/ReactDevToolsSettingsManager": path.resolve(
      webPolyfillsPath,
      "noop.js"
    ),
    "../Components/AccessibilityInfo/legacySendAccessibilityEvent":
      path.resolve(webPolyfillsPath, "noop.js"),
  });

  return config;
};
