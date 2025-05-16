import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";

// Conditionally import real map or web fallback
let MapView, Marker;
if (Platform.OS === "web") {
  const WebMapFallback = require("../components/Map/WebMapFallback");
  MapView = WebMapFallback.MapView;
  Marker = WebMapFallback.Marker;
} else {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  // Import Region type
  type Region = Maps.Region;
}

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useOffline } from "../contexts/OfflineContext";
import { Ionicons } from "@expo/vector-icons";

// Import campus POIs data (will create this in a separate file)
import { CAMPUS_POIS, getBuildingColor } from "../utils/mapUtils";

// Import map components
import MapControls from "../components/Map/MapControls";
import BuildingCallout from "../components/Map/BuildingCallout";

// Navigation prop type
type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Main"
>;

export default function MapScreen() {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 12.806763,
    longitude: 74.932512,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { isOffline, hasOfflineData, getOfflineMapData } = useOffline();
  const [mapPOIs, setMapPOIs] = useState(CAMPUS_POIS);

  // Convert POIs to Building format for display
  const displayBuildings = mapPOIs.map((poi: any, index: number) => ({
    id: index + 1,
    name: poi.name,
    shortName: poi.name.split(" ").pop() || "",
    description: `${poi.name} at PA College of Engineering`,
    latitude: poi.coordinates.latitude.toString(),
    longitude: poi.coordinates.longitude.toString(),
    type: poi.type,
    address: "PA College of Engineering, Mangalore",
    campus: "PA College of Engineering, Mangalore",
  }));
  // Get user location on component mount
  useEffect(() => {
    const loadLocationAndData = async () => {
      setIsLoading(true);

      // Check for offline data if in offline mode
      if (isOffline && hasOfflineData) {
        try {
          const offlineData = await getOfflineMapData();
          if (offlineData) {
            setMapPOIs(offlineData);
          }
        } catch (error) {
          console.error("Error loading offline data:", error);
          setErrorMsg("Failed to load offline map data");
        }
      }

      // Get location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);

        // Optionally center on user location
        // setMapRegion({
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude,
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // });
      } catch (error) {
        console.error("Location error:", error);

        if (isOffline) {
          setErrorMsg("Location services unavailable in offline mode");
        } else {
          setErrorMsg("Could not get your location");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLocationAndData();
  }, [isOffline, hasOfflineData]);

  // Handle building selection
  const handleSelectBuilding = (building: any) => {
    setSelectedBuilding(building);
    setMapRegion({
      latitude: parseFloat(building.latitude),
      longitude: parseFloat(building.longitude),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  // Open building details screen
  const handleOpenBuildingDetails = (building: any) => {
    navigation.navigate("BuildingDetail", {
      buildingId: building.id,
      buildingName: building.name,
    });
  };
  // Open distance calculator
  const handleOpenDistanceCalculator = () => {
    navigation.navigate("DistanceCalculator");
  };

  // Use a state to track map errors
  const [mapError, setMapError] = useState<string | null>(null);

  // Handle map error
  const handleMapError = () => {
    setMapError(
      "Could not load map. Please check your connection and try again."
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading map data...</Text>
        </View>
      )}

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color="#fff" />
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}

      {mapError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
          <Text style={styles.errorText}>{mapError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setMapError(null)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          onError={handleMapError}
        >
          {displayBuildings.map((building: any) => (
            <Marker
              key={building.id}
              coordinate={{
                latitude: parseFloat(building.latitude),
                longitude: parseFloat(building.longitude),
              }}
              title={building.name}
              description={building.description}
              pinColor={getBuildingColor(building.type)}
              onPress={() => handleSelectBuilding(building)}
            >
              <BuildingCallout
                building={building}
                onPress={() => handleOpenBuildingDetails(building)}
              />
            </Marker>
          ))}{" "}
        </MapView>
      )}

      {/* Map controls */}
      <MapControls
        onZoomIn={() => {
          setMapRegion({
            ...mapRegion,
            latitudeDelta: mapRegion.latitudeDelta / 1.5,
            longitudeDelta: mapRegion.longitudeDelta / 1.5,
          });
        }}
        onZoomOut={() => {
          setMapRegion({
            ...mapRegion,
            latitudeDelta: mapRegion.latitudeDelta * 1.5,
            longitudeDelta: mapRegion.longitudeDelta * 1.5,
          });
        }}
        onCenterOnUser={() => {
          if (userLocation) {
            setMapRegion({
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        }}
        onShowDistanceCalculator={handleOpenDistanceCalculator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  offlineBanner: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 5,
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  offlineText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
