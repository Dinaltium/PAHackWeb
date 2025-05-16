/**
 * Web polyfills for React Native modules
 * Exports placeholders for native modules that are not available in web
 */

// Import all polyfills
import Platform from "./Platform";
import Image from "./Image";
import RCTNetworking from "./RCTNetworking";
import RCTAlertManager from "./RCTAlertManager";
import BaseViewConfig from "./BaseViewConfig";
import PlatformColorValueTypes from "./PlatformColorValueTypes";
import noop, { createNoopObject } from "./noop";

// Create noops for other commonly used native modules
const BackHandler = createNoopObject([
  "addEventListener",
  "removeEventListener",
  "exitApp",
]);
const AccessibilityInfo = createNoopObject([
  "addEventListener",
  "removeEventListener",
  "isScreenReaderEnabled",
]);

// Export individual polyfills
export {
  Platform,
  Image,
  RCTNetworking,
  RCTAlertManager,
  BaseViewConfig,
  PlatformColorValueTypes,
  BackHandler,
  AccessibilityInfo,
  noop,
  createNoopObject,
};

// Default export for importing everything at once
export default {
  Platform,
  Image,
  RCTNetworking,
  RCTAlertManager,
  BaseViewConfig,
  PlatformColorValueTypes,
  BackHandler,
  AccessibilityInfo,
  noop,
  createNoopObject,
};
