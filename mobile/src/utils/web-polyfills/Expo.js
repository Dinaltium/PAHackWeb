// Mock implementation for Expo module to avoid parsing issues
// This file is used as a fallback when the original Expo.ts file cannot be parsed by the bundler

const Expo = {
  Asset: {},
  Constants: {},
  FileSystem: {},
  Font: {
    loadAsync: async () => {},
  },
  Linking: {},
  // Add more Expo APIs as needed
};

export default Expo;
