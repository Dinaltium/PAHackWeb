import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { linking } from "./utils/linkingUtils";

// Import screens
import MapScreen from "./screens/MapScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import BuildingDetailScreen from "./screens/BuildingDetailScreen";
import DistanceCalculatorScreen from "./screens/DistanceCalculatorScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Define types for navigation
export type RootStackParamList = {
  Main: undefined;
  BuildingDetail: { buildingId: number; buildingName: string };
  DistanceCalculator: undefined;
};

export type MainTabParamList = {
  Map: undefined;
  Schedule: undefined;
  Settings: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Bottom tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help";

          if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Schedule") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Campus Map",
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: "My Schedule",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}

// Main navigation container
export default function Navigation() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BuildingDetail"
          component={BuildingDetailScreen}
          options={({ route }) => ({
            title: route.params.buildingName || "Building Details",
          })}
        />
        <Stack.Screen
          name="DistanceCalculator"
          component={DistanceCalculatorScreen}
          options={{ title: "Calculate Distance" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
