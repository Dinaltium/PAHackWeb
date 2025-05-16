// This file provides a fallback for LogBox when running on web
// since react-native-web doesn't include LogBox directly
import { Platform } from "react-native";

const EmptyLogBox = {
  ignoreLogs: () => {},
  ignoreAllLogs: () => {},
  install: () => {},
  uninstall: () => {},
};

export default Platform.OS === "web"
  ? EmptyLogBox
  : require("react-native").LogBox;
