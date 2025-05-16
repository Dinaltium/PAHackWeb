/**
 * Entry point for the web version of the PA College Campus Map app
 */
import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import App from "./App";

// Disable React DevTools for production web builds
if (process.env.NODE_ENV === "production") {
  // This helps avoid the source map warnings
  try {
    global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };
  } catch (e) {
    console.log("Could not disable React DevTools");
  }
}

// Polyfill Buffer for web
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

// Ignore specific warnings in web that can't be fixed
LogBox.ignoreLogs([
  "ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component",
  "The provided value 'ms-stream' is not a valid 'responseType'",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'",
  "AsyncStorage has been extracted from react-native",
  "EventEmitter.removeListener",
  "Cannot record touch end without a touch start",
  "Require cycle:",
  "ViewPropTypes will be removed from React Native",
  "exported from 'deprecated-react-native-prop-types'",
  "Non-serializable values were found in the navigation state",
  "Module Warning (from ./node_modules/source-map-loader",
  "Failed to parse source map",
]);

// Set up any web-specific configuration here

// Register the main App component
registerRootComponent(App);
