import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterOnUser: () => void;
  onShowDistanceCalculator: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onCenterOnUser,
  onShowDistanceCalculator,
}: MapControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.controlsGroup}>
        <TouchableOpacity style={styles.controlButton} onPress={onZoomIn}>
          <Ionicons name="add" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={onZoomOut}>
          <Ionicons name="remove" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsGroup}>
        <TouchableOpacity style={styles.controlButton} onPress={onCenterOnUser}>
          <Ionicons name="navigate" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onShowDistanceCalculator}
        >
          <Ionicons name="swap-horizontal" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
  },
  controlsGroup: {
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});
