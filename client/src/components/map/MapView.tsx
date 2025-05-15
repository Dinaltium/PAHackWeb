import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import MapControls from "./MapControls";
import MapMarker from "./MapMarker";
import { useMapProvider } from "@/hooks/useMapProvider";
import { initGoogleMaps } from "@/lib/mapUtils";

interface MapViewProps {
  onMarkerSelect?: (building: Building) => void;
  selectedBuilding?: Building | null;
}

export default function MapView({ onMarkerSelect, selectedBuilding }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [map, setMap] = useState<any | null>(null); // Using any until Google Maps types are loaded
  const [markers, setMarkers] = useState<any[]>([]); // Using any until Google Maps types are loaded
  const { provider, setProvider } = useMapProvider();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const { data: buildings, isLoading } = useQuery<Building[]>({
    queryKey: ['/api/buildings'],
  });

  // Load Google Maps API
  useEffect(() => {
    const loadMaps = async () => {
      try {
        setMapError(null);
        // Use empty key for demo, or get from env variable
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
        
        if (provider === 'google') {
          // Load the Google Maps API
          await initGoogleMaps(apiKey);
          setIsMapLoaded(true);
          toast({
            title: "Maps loaded",
            description: "Google Maps API loaded successfully",
          });
        }
      } catch (error) {
        console.error("Error loading maps:", error);
        setMapError("Could not load map services. Please check your API key.");
        toast({
          title: "Maps Error",
          description: "Could not load map services. Please check your API key.",
          variant: "destructive",
        });
      }
    };

    loadMaps();
  }, [provider, toast]);

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.google) return;

    const defaultLocation = { lat: 34.0689, lng: -118.4452 }; // Default center point
    
    try {
      // Cast to any to avoid type issues
      const mapOptions: any = {
        center: userLocation || defaultLocation,
        zoom: 16,
        mapTypeId: window.google.maps.MapTypeId?.ROADMAP || 'roadmap',
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      // Using any here to avoid type issues
      const googleMaps = window.google.maps;
      if (googleMaps) {
        const newMap = new googleMaps.Map(mapRef.current, mapOptions);
        setMap(newMap);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Could not initialize the map. Please try again later.");
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please try again later.",
        variant: "destructive",
      });
    }

    // Clean up
    return () => {
      setMap(null);
    };
  }, [userLocation, isMapLoaded]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
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

  // Create markers for buildings
  useEffect(() => {
    if (!map || !buildings || !window.google) return;

    // Clear old markers
    markers.forEach(marker => marker.setMap(null));
    
    try {
      const googleMaps = window.google.maps;
      if (!googleMaps) return;
      
      const newMarkers = buildings.map(building => {
        const marker = new googleMaps.Marker({
          position: {
            lat: parseFloat(building.latitude),
            lng: parseFloat(building.longitude),
          },
          map,
          title: building.name,
          icon: {
            path: googleMaps.SymbolPath?.CIRCLE || 0,
            scale: 8,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          },
        });

        marker.addListener("click", () => {
          if (onMarkerSelect) {
            onMarkerSelect(building);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);

      return () => {
        newMarkers.forEach(marker => marker.setMap(null));
      };
    } catch (error) {
      console.error("Error creating map markers:", error);
      setMapError("Could not create map markers. Please refresh the page.");
    }
  }, [map, buildings, onMarkerSelect, isMapLoaded]);

  // Center on selected building
  useEffect(() => {
    if (!map || !selectedBuilding) return;

    try {
      const position = {
        lat: parseFloat(selectedBuilding.latitude),
        lng: parseFloat(selectedBuilding.longitude),
      };

      map.panTo(position);
    } catch (error) {
      console.error("Error centering map:", error);
    }
  }, [map, selectedBuilding]);

  const handleZoomIn = () => {
    if (map) {
      try {
        const currentZoom = map.getZoom() || 15;
        map.setZoom(currentZoom + 1);
      } catch (error) {
        console.error("Error zooming in:", error);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      try {
        const currentZoom = map.getZoom() || 15;
        map.setZoom(currentZoom - 1);
      } catch (error) {
        console.error("Error zooming out:", error);
      }
    }
  };

  const handleCenterOnUser = () => {
    if (map && userLocation) {
      try {
        map.panTo(userLocation);
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
        ref={mapRef} 
        className="map-container bg-neutral-200 relative overflow-hidden"
        style={{ height: "calc(100vh - 64px - 4rem)" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/50">
            <div className="text-primary">Loading map data...</div>
          </div>
        )}
        
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/80">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
              <div className="text-destructive font-medium text-lg mb-2">Map Error</div>
              <p className="text-neutral-700 mb-4">{mapError}</p>
              <div className="text-sm text-neutral-500 mb-4">
                This application requires a Google Maps API key to display the campus map. 
                The map will display in demo mode with limited functionality.
              </div>
              
              {buildings?.length > 0 && (
                <div className="mt-4 text-left">
                  <h3 className="font-medium text-neutral-800 mb-2">Campus Buildings:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {buildings.map(building => (
                      <div 
                        key={building.id}
                        className="p-3 border rounded-md hover:bg-neutral-50 cursor-pointer"
                        onClick={() => onMarkerSelect && onMarkerSelect(building)}
                      >
                        <div className="font-medium">{building.name}</div>
                        <div className="text-sm text-neutral-500">{building.address}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 md:right-20">
        <div className="bg-white rounded-lg shadow-md p-2 flex">
          <button 
            className={`p-2 font-medium ${provider === 'google' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setProvider('google')}
          >
            <i className="fab fa-google text-xl"></i>
          </button>
          <button 
            className={`p-2 font-medium ${provider === 'apple' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setProvider('apple')}
          >
            <i className="fab fa-apple text-xl"></i>
          </button>
        </div>
      </div>
      
      {!mapError && (
        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenterOnUser={handleCenterOnUser}
        />
      )}

      {selectedBuilding && (
        <MapMarker 
          building={selectedBuilding}
          onClose={() => onMarkerSelect && onMarkerSelect(null as any)}
        />
      )}
    </div>
  );
}
