/**
 * Entry point for the web version of the PA College Campus Map app
 */
import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import App from "./App";

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
]);

// Set up any web-specific configuration here

// Register the main App component
registerRootComponent(App);
