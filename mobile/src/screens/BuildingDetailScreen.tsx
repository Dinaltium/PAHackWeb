import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Share,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { Ionicons } from "@expo/vector-icons";
import { getShareableLink } from "../utils/linkingUtils";

// Import campus POIs for fallback
import { CAMPUS_POIS } from "../utils/mapUtils";

// Types and props
type BuildingDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BuildingDetail"
>;

// Building type definition
interface Building {
  id: number;
  name: string;
  shortName?: string;
  description?: string;
  latitude: string;
  longitude: string;
  type: string;
  address?: string;
  campus?: string;
  imageUrl?: string;
}

export default function BuildingDetailScreen({
  route,
  navigation,
}: BuildingDetailScreenProps) {
  const { buildingId } = route.params;
  const [building, setBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Simulating API fetch with local data since we don't have an actual API call yet
  useEffect(() => {
    // In a real app, you would fetch the building details from your API
    // For now, we'll use the campus POIs data
    setTimeout(() => {
      try {
        const foundPoi = CAMPUS_POIS.find(
          (poi, index) => index + 1 === buildingId
        );

        if (foundPoi) {
          setBuilding({
            id: buildingId,
            name: foundPoi.name,
            shortName: foundPoi.name.split(" ").pop() || "",
            description: `${foundPoi.name} is located at PA College of Engineering campus.`,
            latitude: foundPoi.coordinates.latitude.toString(),
            longitude: foundPoi.coordinates.longitude.toString(),
            type: foundPoi.type,
            address: "PA College of Engineering, Mangalore",
            campus: "PA College of Engineering, Mangalore",
            imageUrl: `https://source.unsplash.com/random/400x300/?${foundPoi.type},building`,
          });
        } else {
          setError("Building not found");
        }
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load building details");
        setIsLoading(false);
      }
    }, 800); // Simulate network delay
  }, [buildingId]);
  // Open directions in Google Maps
  const openDirections = () => {
    if (!building) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${building.latitude},${building.longitude}&travelmode=walking`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  // Share building information
  const shareBuilding = async () => {
    if (!building) return;

    try {
      const shareUrl = getShareableLink("BuildingDetail", {
        buildingId: building.id,
        buildingName: building.name,
      });

      await Share.share({
        message: `Check out ${building.name} at PA College of Engineering: ${shareUrl}`,
        url: shareUrl,
        title: `PA College Map - ${building.name}`,
      });
    } catch (error) {
      console.error("Error sharing building:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading building details...</Text>
      </View>
    );
  }

  if (error || !building) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#f44336" />
        <Text style={styles.errorText}>{error || "Building not found"}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: building.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.badge, styles[`badge_${building.type}`]]}>
          <Text style={styles.badgeText}>{building.type}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{building.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{building.address}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{building.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.infoRow}>
          <Ionicons name="navigate-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {building.latitude}, {building.longitude}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={openDirections}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={shareBuilding}>
          <Ionicons name="share-social" size={20} color="#3B82F6" />
          <Text style={styles.shareButtonText}>Share Building Info</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    height: 250,
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  badge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
  },
  badge_academic: {
    backgroundColor: "#3B82F6", // blue
  },
  badge_administrative: {
    backgroundColor: "#6366F1", // indigo
  },
  badge_residence: {
    backgroundColor: "#EC4899", // pink
  },
  badge_dining: {
    backgroundColor: "#F59E0B", // amber
  },
  badge_recreation: {
    backgroundColor: "#10B981", // emerald
  },
  badge_library: {
    backgroundColor: "#6D28D9", // purple
  },
  badge_facility: {
    backgroundColor: "#64748B", // slate
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  directionsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  shareButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
