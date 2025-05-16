import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import MapControls from "./MapControls";
import MapMarker from "./MapMarker";
import DistanceCalculator from "./DistanceCalculator";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  calculateDistance,
  calculateWalkingTime,
  formatDistance,
  getCampusCenter,
} from "@/lib/mapUtils";
import {
  getIconForBuildingType,
  getHighlightedIcon,
  getUserLocationIcon,
} from "@/lib/mapIcons";
import { MapReadyEvent } from "@/types/leaflet-extensions";
import { CAMPUS_POIS } from "@/types/index";

// Fix Leaflet icon issue in React
// This is needed because Leaflet's default icon relies on URLs that don't work in the bundled app
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update the map view when selected building changes
function ChangeMapView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

// Component to initialize map instance and expose it to parent
function MapInitializer({ setMap }: { setMap: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
}

interface LeafletMapViewProps {
  onMarkerSelect?: (building: Building) => void;
  selectedBuilding?: Building | null;
}

export default function LeafletMapView({
  onMarkerSelect,
  selectedBuilding,
}: LeafletMapViewProps) {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const [showDistanceCalculator, setShowDistanceCalculator] = useState(false);
  const { data: buildings, isLoading } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
    onError: (error) => {
      console.error("Failed to fetch buildings:", error);
      toast({
        title: "Data Error",
        description: "Could not load building data. Please try refreshing.",
        variant: "destructive",
      });
    },
  });
  // Fallback to hardcoded campus POIs if API fails
  const displayBuildings: Building[] =
    buildings && buildings.length > 0
      ? buildings
      : CAMPUS_POIS.map((poi, index) => ({
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

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  // Default campus center position
  const defaultPosition: [number, number] = getCampusCenter();

  // Calculate position for selected building
  const selectedPosition = selectedBuilding
    ? ([
        parseFloat(selectedBuilding.latitude),
        parseFloat(selectedBuilding.longitude),
      ] as [number, number])
    : defaultPosition;

  // Calculate walking distance
  const getWalkingInfo = (buildingLat: number, buildingLng: number) => {
    if (!userLocation) return null;

    try {
      const distance = calculateDistance(
        userLocation[0],
        userLocation[1],
        buildingLat,
        buildingLng
      );

      const walkingTime = calculateWalkingTime(distance);

      return {
        distance: Math.round(distance),
        walkingTime,
      };
    } catch (error) {
      console.error("Error calculating walking info:", error);
      return null;
    }
  };
  // Function to handle map initialization
  useEffect(() => {
    // Set mapLoaded to true when map is set
    if (map) {
      setMapLoaded(true);
    }
  }, [map]);

  // Map control functions
  const handleZoomIn = () => {
    if (map) {
      try {
        const currentZoom = map.getZoom();
        map.setZoom(currentZoom + 1);
      } catch (error) {
        console.error("Error zooming in:", error);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      try {
        const currentZoom = map.getZoom();
        map.setZoom(currentZoom - 1);
      } catch (error) {
        console.error("Error zooming out:", error);
      }
    }
  };
  const handleCenterOnUser = () => {
    if (map && userLocation) {
      try {
        map.setView(userLocation, 18);
      } catch (error) {
        console.error("Error centering on user:", error);
      }
    } else {
      toast({
        title: "Location Error",
        description: "Unable to determine your location.",
        variant: "destructive",
      });
    }
  };

  const handleShowDistanceCalculator = () => {
    setShowDistanceCalculator(true);
  };

  return (
    <div className="relative">
      {" "}
      <div
        className="map-container bg-neutral-200 relative overflow-hidden rounded-lg"
        style={{ height: "calc(100vh - 64px - 2rem)" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/50 z-50">
            <div className="text-primary">Loading map data...</div>
          </div>
        )}{" "}
        <MapContainer
          center={userLocation || defaultPosition}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
          minZoom={14}
          maxZoom={19}
        >
          <MapInitializer setMap={setMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />{" "}
          {displayBuildings?.map((building) => (
            <Marker
              key={building.id}
              position={[
                parseFloat(building.latitude),
                parseFloat(building.longitude),
              ]}
              eventHandlers={{
                click: () => {
                  if (onMarkerSelect) {
                    onMarkerSelect(building);
                  }
                },
              }}
              icon={getIconForBuildingType(building.type)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-neutral-800">
                    {building.name}
                  </h3>
                  {building.address && (
                    <p className="text-sm text-neutral-600">
                      {building.address}
                    </p>
                  )}{" "}
                  {userLocation && (
                    <div className="mt-2">
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <i className="fa fa-route mr-1"></i> Distance & Time
                      </div>
                      {(() => {
                        const walkInfo = getWalkingInfo(
                          parseFloat(building.latitude),
                          parseFloat(building.longitude)
                        );
                        return walkInfo ? (
                          <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                            <div className="flex items-center text-neutral-700">
                              <i className="fa fa-walking mr-1"></i>{" "}
                              {formatDistance(walkInfo.distance)}
                            </div>
                            <div className="flex items-center text-neutral-700">
                              <i className="fa fa-clock mr-1"></i>{" "}
                              {walkInfo.walkingTime} min
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-500">
                            Distance unknown
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          {/* User marker */}
          {userLocation && (
            <Marker position={userLocation} icon={getUserLocationIcon()}>
              <Popup>
                <div>Your Location</div>
              </Popup>
            </Marker>
          )}
          {/* Update view when selected building changes */}
          {selectedBuilding && (
            <ChangeMapView center={selectedPosition} zoom={18} />
          )}
        </MapContainer>
      </div>{" "}
      {mapLoaded && (
        <div className="absolute left-4 bottom-4 z-30">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onCenterOnUser={handleCenterOnUser}
            onShowDistanceCalculator={handleShowDistanceCalculator}
          />
        </div>
      )}
      {/* Distance Calculator Popup */}{" "}
      {mapLoaded && showDistanceCalculator && (
        <div className="absolute left-4 top-20 z-50 map-marker-animation">
          <DistanceCalculator
            onClose={() => setShowDistanceCalculator(false)}
          />
        </div>
      )}
      {mapLoaded && selectedBuilding && (
        <div className="absolute top-4 right-4 z-40 max-w-xs">
          <MapMarker
            building={selectedBuilding}
            onClose={() => onMarkerSelect && onMarkerSelect(null as any)}
          />
        </div>
      )}
    </div>
  );
}
