import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { CAMPUS_POIS } from "../utils/mapUtils";

// Calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate walking time in minutes
function calculateWalkingTime(distanceInMeters: number): number {
  // Average walking speed: 1.4 m/s or 84 m/min
  const walkingSpeedMeterPerMinute = 84;
  return Math.round(distanceInMeters / walkingSpeedMeterPerMinute);
}

// Format distance
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(2)} km`;
  }
}

export default function DistanceCalculatorScreen() {
  const [startPoint, setStartPoint] = useState<string | null>(null);
  const [endPoint, setEndPoint] = useState<string | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: number;
    time: number;
  } | null>(null);

  // Calculate distance when both points are selected
  useEffect(() => {
    if (startPoint && endPoint) {
      const start = CAMPUS_POIS.find((poi) => poi.name === startPoint);
      const end = CAMPUS_POIS.find((poi) => poi.name === endPoint);

      if (start && end) {
        const distance = calculateDistance(
          start.coordinates.latitude,
          start.coordinates.longitude,
          end.coordinates.latitude,
          end.coordinates.longitude
        );

        const time = calculateWalkingTime(distance);

        setDistanceInfo({ distance, time });
      }
    } else {
      setDistanceInfo(null);
    }
  }, [startPoint, endPoint]);

  // Handle navigate button press
  const handleNavigate = () => {
    if (!startPoint || !endPoint) return;

    const start = CAMPUS_POIS.find((poi) => poi.name === startPoint);
    const end = CAMPUS_POIS.find((poi) => poi.name === endPoint);

    if (start && end) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${start.coordinates.latitude},${start.coordinates.longitude}&destination=${end.coordinates.latitude},${end.coordinates.longitude}&travelmode=walking`;
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="navigate" size={24} color="#3B82F6" />
          <Text style={styles.cardTitle}>Distance Calculator</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Starting Point</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={startPoint}
              onValueChange={(itemValue) => setStartPoint(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select starting point" value={null} />
              {CAMPUS_POIS.map((poi) => (
                <Picker.Item
                  key={`start-${poi.name}`}
                  label={poi.name}
                  value={poi.name}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Destination</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={endPoint}
              onValueChange={(itemValue) => setEndPoint(itemValue)}
              style={styles.picker}
              enabled={!!startPoint}
            >
              <Picker.Item label="Select destination" value={null} />
              {CAMPUS_POIS.filter((poi) => poi.name !== startPoint).map(
                (poi) => (
                  <Picker.Item
                    key={`end-${poi.name}`}
                    label={poi.name}
                    value={poi.name}
                  />
                )
              )}
            </Picker>
          </View>
        </View>

        {distanceInfo && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Results:</Text>

            <View style={styles.resultRow}>
              <View style={styles.resultItem}>
                <Ionicons name="walk-outline" size={24} color="#3B82F6" />
                <Text style={styles.resultLabel}>Distance</Text>
                <Text style={styles.resultValue}>
                  {formatDistance(distanceInfo.distance)}
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Ionicons name="time-outline" size={24} color="#3B82F6" />
                <Text style={styles.resultLabel}>Walking Time</Text>
                <Text style={styles.resultValue}>{distanceInfo.time} min</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.navigateButton}
              onPress={handleNavigate}
            >
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.navigateButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={styles.cardTitle}>How it works</Text>
        </View>

        <Text style={styles.infoText}>
          The Distance Calculator helps you estimate the walking distance and
          time between any two locations on campus.
        </Text>

        <Text style={styles.infoText}>
          Simply select your starting point and destination from the dropdown
          menus, and we'll show you the estimated walking distance and time.
        </Text>

        <Text style={styles.infoText}>
          You can also get turn-by-turn directions by tapping the "Get
          Directions" button.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  resultContainer: {
    marginTop: 16,
    backgroundColor: "#f0f7ff",
    padding: 16,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  resultItem: {
    alignItems: "center",
    padding: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
});
