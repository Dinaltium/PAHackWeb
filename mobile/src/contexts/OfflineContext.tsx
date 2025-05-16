import React, { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CAMPUS_POIS } from "../utils/mapUtils";
import { Alert } from "react-native";

// Define types
type OfflineContextType = {
  isOffline: boolean;
  hasOfflineData: boolean;
  saveMapDataOffline: () => Promise<void>;
  getOfflineMapData: () => Promise<any>;
  clearOfflineData: () => Promise<void>;
};

// Create context
const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

// Keys for async storage
const STORAGE_KEYS = {
  MAP_DATA: "offline_map_data",
  SCHEDULE_DATA: "offline_schedule_data",
  LAST_UPDATED: "offline_last_updated",
};

// Provider component
export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  // Check network status and offline data on mount
  useEffect(() => {
    // Setup network status listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    // Check if we have cached offline data
    checkOfflineData();

    return () => {
      unsubscribe();
    };
  }, []);

  // Check if offline data exists
  const checkOfflineData = async () => {
    try {
      const mapData = await AsyncStorage.getItem(STORAGE_KEYS.MAP_DATA);
      setHasOfflineData(!!mapData);
    } catch (error) {
      console.error("Error checking offline data:", error);
      setHasOfflineData(false);
    }
  };

  // Save map data for offline use
  const saveMapDataOffline = async () => {
    try {
      // Save campus POIs
      await AsyncStorage.setItem(
        STORAGE_KEYS.MAP_DATA,
        JSON.stringify(CAMPUS_POIS)
      );

      // Save timestamp
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_UPDATED,
        new Date().toISOString()
      );

      setHasOfflineData(true);
      Alert.alert("Success", "Map data saved for offline use");
    } catch (error) {
      console.error("Error saving offline data:", error);
      Alert.alert("Error", "Failed to save data for offline use");
    }
  };

  // Get offline map data
  const getOfflineMapData = async () => {
    try {
      const mapData = await AsyncStorage.getItem(STORAGE_KEYS.MAP_DATA);
      if (mapData) {
        return JSON.parse(mapData);
      }
      return null;
    } catch (error) {
      console.error("Error retrieving offline data:", error);
      return null;
    }
  };

  // Clear all offline data
  const clearOfflineData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.MAP_DATA,
        STORAGE_KEYS.SCHEDULE_DATA,
        STORAGE_KEYS.LAST_UPDATED,
      ]);
      setHasOfflineData(false);
      Alert.alert("Success", "Offline data cleared");
    } catch (error) {
      console.error("Error clearing offline data:", error);
      Alert.alert("Error", "Failed to clear offline data");
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        hasOfflineData,
        saveMapDataOffline,
        getOfflineMapData,
        clearOfflineData,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

// Custom hook to use the offline context
export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
};
