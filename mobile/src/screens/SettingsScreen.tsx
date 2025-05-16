import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOffline } from "../contexts/OfflineContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Setting option component
interface SettingOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const SettingOption = ({
  icon,
  title,
  description,
  onPress,
  isSwitch,
  value,
  onValueChange,
}: SettingOptionProps) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={isSwitch}
  >
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={24} color="#3B82F6" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {description && (
        <Text style={styles.settingDescription}>{description}</Text>
      )}
    </View>
    {isSwitch && (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ddd", true: "#bfdbfe" }}
        thumbColor={value ? "#3B82F6" : "#f4f3f4"}
      />
    )}
    {!isSwitch && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
  </TouchableOpacity>
);

// Settings screen
export default function SettingsScreen() {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [offlineMapsEnabled, setOfflineMapsEnabled] = useState(false);
  const { hasOfflineData, saveMapDataOffline, clearOfflineData } = useOffline();

  // Check offline settings on mount
  useEffect(() => {
    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem("offlineMapsEnabled");
        if (storedValue !== null) {
          setOfflineMapsEnabled(storedValue === "true");
        }
      } catch (error) {
        console.error("Error loading offline settings:", error);
      }
    })();
  }, []);

  // Handle offline mode toggle
  const handleOfflineModeToggle = async (value: boolean) => {
    try {
      setOfflineMapsEnabled(value);
      await AsyncStorage.setItem("offlineMapsEnabled", value.toString());

      if (value && !hasOfflineData) {
        // If enabling offline mode and no data is saved yet, save it
        await saveMapDataOffline();
      } else if (!value && hasOfflineData) {
        // If disabling offline mode, ask if they want to clear data
        Alert.alert(
          "Clear Offline Data",
          "Do you want to clear saved offline map data?",
          [
            { text: "No", style: "cancel" },
            { text: "Yes", onPress: clearOfflineData },
          ]
        );
      }
    } catch (error) {
      console.error("Error saving offline setting:", error);
    }
  };

  // Reset app settings (demo)
  const handleResetSettings = async () => {
    setLocationEnabled(true);
    setNotificationsEnabled(true);
    setDarkModeEnabled(false);
    setOfflineMapsEnabled(false);

    try {
      await AsyncStorage.multiRemove(["offlineMapsEnabled"]);
      await clearOfflineData();
      Alert.alert("Success", "Settings have been reset to defaults");
    } catch (error) {
      console.error("Error resetting settings:", error);
      Alert.alert("Error", "Failed to reset settings");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account</Text>

        <View style={styles.card}>
          <SettingOption
            icon="person-outline"
            title="Your Profile"
            description="View and edit your profile"
            onPress={() => alert("Profile not implemented in demo")}
          />

          <View style={styles.separator} />

          <SettingOption
            icon="notifications-outline"
            title="Notifications"
            description="Manage notification preferences"
            isSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* Map Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Map Settings</Text>

        <View style={styles.card}>
          <SettingOption
            icon="locate-outline"
            title="Location Services"
            description="Enable location tracking"
            isSwitch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
          />

          <View style={styles.separator} />
          <SettingOption
            icon="map-outline"
            title="Download Offline Maps"
            description="Access maps without internet"
            isSwitch
            value={offlineMapsEnabled}
            onValueChange={handleOfflineModeToggle}
          />

          <View style={styles.separator} />

          {offlineMapsEnabled && hasOfflineData && (
            <>
              <SettingOption
                icon="cloud-download-outline"
                title="Update Offline Data"
                description="Refresh saved map data"
                onPress={saveMapDataOffline}
              />

              <View style={styles.separator} />
            </>
          )}

          <SettingOption
            icon="options-outline"
            title="Map Display Options"
            description="Customize your map appearance"
            onPress={() => alert("Map options not implemented in demo")}
          />
        </View>
      </View>

      {/* App Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>App Settings</Text>

        <View style={styles.card}>
          <SettingOption
            icon="moon-outline"
            title="Dark Mode"
            description="Change app appearance"
            isSwitch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />

          <View style={styles.separator} />

          <SettingOption
            icon="refresh-outline"
            title="Reset All Settings"
            description="Restore default settings"
            onPress={handleResetSettings}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>About</Text>

        <View style={styles.card}>
          <SettingOption
            icon="information-circle-outline"
            title="About PA Campus Map"
            description="Version 1.0.0"
            onPress={() =>
              alert(
                "PA Campus Map\nVersion 1.0.0\nDeveloped for PA College of Engineering"
              )
            }
          />

          <View style={styles.separator} />

          <SettingOption
            icon="help-circle-outline"
            title="Help & Support"
            description="Get assistance with the app"
            onPress={() => alert("Contact campus IT support for assistance")}
          />

          <View style={styles.separator} />

          <SettingOption
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => alert("Terms of Service not implemented in demo")}
          />

          <View style={styles.separator} />

          <SettingOption
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => alert("Privacy Policy not implemented in demo")}
          />
        </View>
      </View>

      <Text style={styles.footerText}>© 2025 PA College of Engineering</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 68,
  },
  footerText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginVertical: 16,
  },
});
