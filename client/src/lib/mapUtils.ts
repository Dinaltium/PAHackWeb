/**
 * Calculate distance between two geographic coordinates
 * @param lat1 First latitude
 * @param lon1 First longitude
 * @param lat2 Second latitude
 * @param lon2 Second longitude
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Convert to meters
  return distance;
}

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate the estimated walking time between two points
 * @param distanceInMeters Distance in meters
 * @returns Walking time in minutes (rounded up)
 */
export function calculateWalkingTime(distanceInMeters: number): number {
  // Average walking speed is about 5km/h or ~83 meters per minute
  const walkingSpeedMPerMinute = 83;
  return Math.ceil(distanceInMeters / walkingSpeedMPerMinute);
}

/**
 * Initialize Leaflet Map
 * @returns Promise that resolves immediately since Leaflet doesn't require external loading
 */
export function initLeafletMap(): Promise<void> {
  return Promise.resolve();
}

/**
 * Format walking distance for display
 * @param distanceInMeters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  } else {
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  }
}

/**
 * Get center point of campus
 * This function provides a default center point for the map
 * @returns [latitude, longitude]
 */
export function getCampusCenter(): [number, number] {
  // Default campus center (can be configured for specific campus)
  return [34.0689, -118.4452]; 
}
