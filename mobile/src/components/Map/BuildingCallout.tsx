import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

interface BuildingCalloutProps {
  building: {
    id: number;
    name: string;
    description?: string;
    type: string;
  };
  onPress: () => void;
}

export default function BuildingCallout({
  building,
  onPress,
}: BuildingCalloutProps) {
  // Get icon based on building type
  const getBuildingIcon = () => {
    switch (building.type) {
      case "academic":
        return "school-outline";
      case "administrative":
        return "business-outline";
      case "residence":
        return "home-outline";
      case "dining":
        return "restaurant-outline";
      case "recreation":
        return "fitness-outline";
      case "library":
        return "book-outline";
      case "facility":
        return "construct-outline";
      default:
        return "location-outline";
    }
  };

  return (
    <Callout tooltip onPress={onPress}>
      <View style={styles.calloutContainer}>
        <View style={styles.calloutHeader}>
          <Ionicons name={getBuildingIcon() as any} size={18} color="#3B82F6" />
          <Text style={styles.calloutTitle} numberOfLines={1}>
            {building.name}
          </Text>
        </View>

        {building.description && (
          <Text style={styles.calloutDescription} numberOfLines={2}>
            {building.description}
          </Text>
        )}

        <TouchableOpacity style={styles.calloutButton} onPress={onPress}>
          <Text style={styles.calloutButtonText}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </Callout>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  calloutTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    flex: 1,
  },
  calloutDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  calloutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    marginTop: 4,
  },
  calloutButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3B82F6",
  },
});
