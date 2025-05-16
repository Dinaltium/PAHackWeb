/**
 * Web Image polyfill for React Native
 */
import { Image as RNImage } from "react-native";

// For web, we use the regular Image component from React Native
// but add any missing methods that native code might expect
const Image = RNImage;

// Add any missing static methods/properties here
Image.getSize =
  Image.getSize ||
  ((uri, success, failure) => {
    const img = new window.Image();
    img.onload = () => {
      success(img.width, img.height);
    };
    img.onerror = failure;
    img.src = uri;
  });

Image.prefetch = Image.prefetch || (() => Promise.resolve(true));

export default Image;
