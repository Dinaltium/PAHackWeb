import { Map, MapOptions } from "leaflet";

// Extension for the Leaflet map readiness event
export interface MapReadyEvent {
  target: Map;
}

// Interface for specifying the readiness handler
export interface MapReadyOptions extends MapOptions {
  whenReady?: (event: MapReadyEvent) => void;
}
