// Map for storing campus points of interest
export const CAMPUS_POIS = [
  {
    name: "Central Library",
    coordinates: { latitude: 12.806626789025971, longitude: 74.93297528724706 },
    type: "library",
  },
  {
    name: "Pace Workshop",
    coordinates: { latitude: 12.806594934779813, longitude: 74.93156237993341 },
    type: "academic",
  },
  {
    name: "Parking",
    coordinates: { latitude: 12.806381640041346, longitude: 74.93194055906237 },
    type: "facility",
  },
  {
    name: "College ATM",
    coordinates: { latitude: 12.80660419426253, longitude: 74.93238242142701 },
    type: "facility",
  },
  {
    name: "PACE Auditorium",
    coordinates: { latitude: 12.807692933393275, longitude: 74.9323815995066 },
    type: "administrative",
  },
  {
    name: "PACE Masjid",
    coordinates: { latitude: 12.808634120489803, longitude: 74.93362402415325 },
    type: "facility",
  },
  {
    name: "PACE Pharmacy",
    coordinates: { latitude: 12.808499317546259, longitude: 74.93238019630758 },
    type: "facility",
  },
  {
    name: "Boys Hostel",
    coordinates: { latitude: 12.809797397164683, longitude: 74.93348459882178 },
    type: "residence",
  },
  {
    name: "Ikku's Shop",
    coordinates: { latitude: 12.809679205169092, longitude: 74.93358188473309 },
    type: "dining",
  },
];

// Map building types to colors
export function getBuildingColor(type: string): string {
  switch (type) {
    case "academic":
      return "#3B82F6"; // blue
    case "administrative":
      return "#6366F1"; // indigo
    case "residence":
      return "#EC4899"; // pink
    case "dining":
      return "#F59E0B"; // amber
    case "recreation":
      return "#10B981"; // emerald
    case "library":
      return "#6D28D9"; // purple
    case "facility":
      return "#64748B"; // slate
    default:
      return "#EF4444"; // red
  }
}

// Get campus center location
export function getCampusCenter(): { latitude: number; longitude: number } {
  return { latitude: 12.806763, longitude: 74.932512 };
}

// Calculate distance between two points (in meters)
export function calculateDistance(
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

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(2)} km`;
  }
}

// Calculate walking time in minutes
export function calculateWalkingTime(distanceInMeters: number): number {
  // Average walking speed: 1.4 m/s or 84 m/min
  const walkingSpeedMeterPerMinute = 84;
  return Math.round(distanceInMeters / walkingSpeedMeterPerMinute);
}
