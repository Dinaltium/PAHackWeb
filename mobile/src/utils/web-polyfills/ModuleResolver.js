/**
 * Module resolver for React Native web
 * Automatically exports all polyfills for easier importing
 */
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

// Default export
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
