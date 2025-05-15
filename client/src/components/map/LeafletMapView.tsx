import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import MapControls from "./MapControls";
import MapMarker from "./MapMarker";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { calculateDistance, calculateWalkingTime, formatDistance, getCampusCenter } from "@/lib/mapUtils";

// Fix Leaflet icon issue in React
// This is needed because Leaflet's default icon relies on URLs that don't work in the bundled app
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update the map view when selected building changes
function ChangeMapView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

interface LeafletMapViewProps {
  onMarkerSelect?: (building: Building) => void;
  selectedBuilding?: Building | null;
}

export default function LeafletMapView({ onMarkerSelect, selectedBuilding }: LeafletMapViewProps) {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  const { data: buildings, isLoading } = useQuery<Building[]>({
    queryKey: ['/api/buildings'],
  });

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
    ? [parseFloat(selectedBuilding.latitude), parseFloat(selectedBuilding.longitude)] as [number, number]
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
        walkingTime
      };
    } catch (error) {
      console.error("Error calculating walking info:", error);
      return null;
    }
  };

  // Function to handle map initialization
  useEffect(() => {
    // This will run after the component is mounted
    // We set a timeout to ensure the map is rendered
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  return (
    <div className="relative">
      <div 
        className="map-container bg-neutral-200 relative overflow-hidden"
        style={{ height: "calc(100vh - 64px - 4rem)" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/50 z-50">
            <div className="text-primary">Loading map data...</div>
          </div>
        )}
        
        <MapContainer 
          center={userLocation || defaultPosition} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
          whenReady={(mapEvent) => setMap(mapEvent.target)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {buildings?.map((building) => (
            <Marker 
              key={building.id}
              position={[parseFloat(building.latitude), parseFloat(building.longitude)]}
              eventHandlers={{
                click: () => {
                  if (onMarkerSelect) {
                    onMarkerSelect(building);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-neutral-800">{building.name}</h3>
                  {building.address && (
                    <p className="text-sm text-neutral-600">{building.address}</p>
                  )}
                  {userLocation && (
                    <div className="text-xs text-neutral-500 mt-1">
                      {(() => {
                        const walkInfo = getWalkingInfo(
                          parseFloat(building.latitude), 
                          parseFloat(building.longitude)
                        );
                        return walkInfo 
                          ? `${formatDistance(walkInfo.distance)} · ${walkInfo.walkingTime} min walk` 
                          : 'Distance unknown';
                      })()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* User marker */}
          {userLocation && (
            <Marker 
              position={userLocation}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div>Your Location</div>
              </Popup>
            </Marker>
          )}
          
          {/* Update view when selected building changes */}
          {selectedBuilding && (
            <ChangeMapView 
              center={selectedPosition} 
              zoom={18} 
            />
          )}
        </MapContainer>
      </div>
      
      {mapLoaded && (
        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenterOnUser={handleCenterOnUser}
        />
      )}
      
      {mapLoaded && selectedBuilding && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <MapMarker 
            building={selectedBuilding}
            onClose={() => onMarkerSelect && onMarkerSelect(null as any)}
          />
        </div>
      )}
    </div>
  );
}