// Building types for our campus map
export type BuildingType =
  | "academic" // Education buildings, classrooms, labs
  | "administrative" // Admin offices, management
  | "residence" // Hostels, staff quarters
  | "dining" // Cafeterias, canteens, food stalls
  | "recreation" // Sports areas, gyms, entertainment
  | "library" // Libraries, study areas
  | "facility" // Support services like ATM, shops, etc.
  | "default"; // Fallback type

// Distance information between two points
export interface DistanceInfo {
  distance: number; // Distance in meters
  time: number; // Walking time in minutes
}

// Location coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Map of all campus POIs (Points of Interest)
export const CAMPUS_POIS = [
  {
    name: "Central Library",
    coordinates: { latitude: 12.806626789025971, longitude: 74.93297528724706 },
    type: "library" as BuildingType,
  },
  {
    name: "Pace Workshop",
    coordinates: { latitude: 12.806594934779813, longitude: 74.93156237993341 },
    type: "academic" as BuildingType,
  },
  {
    name: "Parking",
    coordinates: { latitude: 12.806381640041346, longitude: 74.93194055906237 },
    type: "facility" as BuildingType,
  },
  {
    name: "College ATM",
    coordinates: { latitude: 12.80660419426253, longitude: 74.93238242142701 },
    type: "facility" as BuildingType,
  },
  {
    name: "PACE Auditorium",
    coordinates: { latitude: 12.807692933393275, longitude: 74.9323815995066 },
    type: "administrative" as BuildingType,
  },
  {
    name: "PACE Masjid",
    coordinates: { latitude: 12.808634120489803, longitude: 74.93362402415325 },
    type: "facility" as BuildingType,
  },
  {
    name: "PACE Pharmacy",
    coordinates: { latitude: 12.808499317546259, longitude: 74.93238019630758 },
    type: "facility" as BuildingType,
  },
  {
    name: "Boys Hostel",
    coordinates: { latitude: 12.809797397164683, longitude: 74.93348459882178 },
    type: "residence" as BuildingType,
  },
  {
    name: "Ikku's Shop",
    coordinates: { latitude: 12.809679205169092, longitude: 74.93358188473309 },
    type: "dining" as BuildingType,
  },
];
