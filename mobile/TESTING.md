# PA College Campus Map Mobile App - Testing Guide

This document provides instructions for testing the PA College Campus Map mobile application on both emulators and physical devices.

## Prerequisites

Before testing, make sure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator)
- Xcode (for iOS simulator, macOS only)
- Expo Go app on your physical device (available on App Store and Google Play)

## Running the App on Emulators

### Android Emulator

1. Start your Android emulator from Android Studio's AVD Manager
2. Open a terminal and navigate to the mobile app directory:
   ```
   cd c:\HackathonPace\PAHackWeb\mobile
   ```
3. Install dependencies if you haven't already:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Press 'a' to run on Android emulator

### iOS Simulator (macOS only)

1. Open a terminal and navigate to the mobile app directory:
   ```
   cd c:\HackathonPace\PAHackWeb\mobile
   ```
2. Start the development server:
   ```
   npm start
   ```
3. Press 'i' to run on iOS simulator

## Testing on Physical Devices

1. Ensure your device and development machine are on the same WiFi network
2. Install the Expo Go app from the App Store (iOS) or Google Play Store (Android)
3. Start the development server:
   ```
   npm start
   ```
4. Scan the QR code displayed in the terminal or browser with your device's camera (iOS) or with the Expo Go app (Android)

## Key Features to Test

### 1. Campus Map

- Test loading the map
- Test panning and zooming
- Verify building markers appear correctly
- Test tapping on markers to view building information
- Test opening building details
- Verify your current location is shown (requires location permissions)

### 2. Building Details

- Test navigation to building details
- Verify building information is displayed correctly
- Test the "Get Directions" button
- Test the "Share Building Info" button (verify deep linking works)

### 3. Distance Calculator

- Test selecting start and end points
- Verify distance and walking time calculations
- Test the "Get Directions" button to open navigation

### 4. Class Schedule

- Verify schedule items are displayed correctly
- Test day filter tabs
- Test notification reminders for classes

### 5. Offline Functionality

To test offline functionality:

1. Enable offline mode in Settings
2. Turn on Airplane mode or disable WiFi
3. Verify the app displays cached map data
4. Check that the offline indicator is shown

### 6. Deep Linking

Test deep linking by:

1. Sharing a building using the share button
2. Opening the shared link on another device or emulator
3. Verify the app opens to the correct building detail screen

## Debugging

If you encounter issues:

1. Check the console output for errors
2. Ensure all dependencies are installed
3. Try stopping and restarting the development server
4. Clear the app cache on your device or emulator

## Performance Testing

Pay attention to:

- App startup time
- Map loading and rendering performance
- Smoothness of animations and transitions
- Memory usage over time

## Known Issues

- Location accuracy may vary depending on device and environment
- Deep linking may not work in all environments due to app URL scheme registration
- Offline mode requires manual enabling before going offline
