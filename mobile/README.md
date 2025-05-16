# PA College Engineering Campus Map - Mobile App

This is the mobile app version of the PA College of Engineering Campus Map, built using React Native and Expo.

## Features

- Interactive campus map showing all buildings and points of interest
- Building details with information about each location
- Distance calculator to measure walking time between campus locations
- Class schedule viewer and management
- User location tracking and navigation
- Offline map data support
- Deep linking between web and mobile versions
- Schedule notification reminders

## Tech Stack

- **React Native**: Cross-platform mobile app framework
- **Expo**: Development platform for React Native
- **React Navigation**: Navigation library for React Native apps
- **React Native Maps**: Google Maps integration
- **React Query**: Data fetching and state management
- **Expo Notifications**: Push notifications and reminders
- **AsyncStorage**: Local data persistence for offline functionality

## Directory Structure

```
mobile/
  ├── App.tsx                # Main app container
  ├── src/
  │   ├── navigation.tsx     # Navigation configuration
  │   ├── components/        # Reusable UI components
  │   │   ├── Map/           # Map-related components
  │   │   ├── Schedule/      # Schedule-related components
  │   │   └── common/        # Shared UI components
  │   ├── screens/           # Application screens
  │   │   ├── MapScreen.tsx
  │   │   ├── ScheduleScreen.tsx
  │   │   ├── BuildingDetailScreen.tsx
  │   │   ├── DistanceCalculatorScreen.tsx
  │   │   └── SettingsScreen.tsx
  │   ├── hooks/             # Custom React hooks
  │   ├── api/               # API clients and data fetching
  │   └── utils/             # Utility functions
  └── assets/                # Images and other static assets
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI
- Android Studio/Xcode for emulators (optional)

### Installation

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm start
   ```

   Or if you don't want to create an Expo account:

   ```
   npx expo start --offline
   ```

3. Follow the instructions in the terminal to open the app on:
   - An iOS simulator
   - An Android emulator
   - Your physical device using the Expo Go app

### Building for Production

To create a production build, you'll need an Expo account:

1. Create an account at [https://expo.dev/signup](https://expo.dev/signup)
2. Log in with the Expo CLI:
   ```
   npx expo login
   ```
3. Build the app:
   ```
   npx expo build:android  # For Android
   npx expo build:ios      # For iOS
   ```

Alternatively, you can use EAS Build (recommended):

```
npx eas build --platform android
npx eas build --platform ios
```

### Running the Web Version

To run the app in a web browser:

```
npm run web
```

Or using the Expo CLI:

```
npx expo start --web
```

## Data Integration

The mobile app shares data with the web application through a common API and shared data models. Key shared elements include:

- Building and POI data
- Distance calculation utilities
- User preferences

## Expo Account Information

### Do I Need an Expo Account?

- **For Development**: No. You can run the app locally without an Expo account using the `--offline` flag as mentioned in the Installation section.
- **For Publishing**: Yes. If you want to build standalone apps or publish to app stores, you'll need an Expo account.

### Benefits of an Expo Account

- Access to Expo Application Services (EAS)
- OTA (Over-The-Air) updates
- Push notification services
- Build services for creating standalone apps

### Creating an Expo Account

1. Visit [https://expo.dev/signup](https://expo.dev/signup)
2. Enter your email, username, and password
3. Verify your email
4. Log in with the Expo CLI:
   ```
   npx expo login
   ```

## Offline Mode

The app includes an offline mode that allows users to:

- Cache map data for offline viewing
- View schedules without an internet connection
- Toggle between online and offline modes

This is managed through the `OfflineContext` provider in `src/contexts/OfflineContext.tsx`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License.
