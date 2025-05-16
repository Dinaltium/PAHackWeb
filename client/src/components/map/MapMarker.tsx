import { Building } from "@shared/schema";
import { MapPin, Info, Navigation, Clock, Route } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  calculateDistance,
  calculateWalkingTime,
  formatDistance,
} from "@/lib/mapUtils";
import DirectionsCalculator from "./DirectionsCalculator";

interface MapMarkerProps {
  building: Building;
  onClose: () => void;
}

export default function MapMarker({ building, onClose }: MapMarkerProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: number;
    time: number;
  } | null>(null);

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  // Get user location and calculate distance
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);

          // Calculate distance and time
          const buildingLat = parseFloat(building.latitude);
          const buildingLng = parseFloat(building.longitude);
          const distance = calculateDistance(
            location[0],
            location[1],
            buildingLat,
            buildingLng
          );
          const time = calculateWalkingTime(distance);
          setDistanceInfo({ distance, time });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [building]);

  // Find next class in this building if any
  const nextCourse = courses?.find((course) => {
    const classroom = course.classroomId; // In a real app, join with classroom data to check building
    return classroom === 1; // Hardcoded for demo to match Science Building
  });

  const getTimeUntilClass = () => {
    if (!nextCourse) return null;

    // For demo purposes, just return "15 min"
    return "15 min";
  };

  // Get icon color based on building type
  const getBuildingIcon = () => {
    switch (building.type) {
      case "academic":
        return <i className="fa fa-school text-blue-500"></i>;
      case "administrative":
        return <i className="fa fa-building text-indigo-500"></i>;
      case "residence":
        return <i className="fa fa-home text-pink-500"></i>;
      case "dining":
        return <i className="fa fa-utensils text-amber-500"></i>;
      case "recreation":
        return <i className="fa fa-dumbbell text-emerald-500"></i>;
      case "library":
        return <i className="fa fa-book text-purple-500"></i>;
      case "facility":
        return <i className="fa fa-landmark text-slate-500"></i>;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  return (
    <div>
      <div className="relative">
        {" "}
        <Card className="shadow-lg w-full max-w-xs bg-white/95 backdrop-blur-sm map-marker-card map-marker-animation">
          <div className="border-b border-neutral-200 bg-primary/10 p-2 rounded-t-lg flex justify-between items-center">
            <div className="font-semibold text-neutral-800 flex items-center gap-2">
              {getBuildingIcon()}
              {building.name}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <i className="fa fa-times text-sm"></i>
            </Button>
          </div>
          <CardContent className="p-3">
            <div className="text-sm text-neutral-600 mt-1">
              {building.description || "No description available"}
            </div>
            {/* Distance and walking time information */}
            {distanceInfo && (
              <div className="mt-2 border-t border-neutral-100 pt-2">
                <div className="text-sm font-medium text-blue-600 flex items-center gap-1">
                  <i className="fa fa-route"></i> Distance & Walking Time
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center text-sm text-neutral-700">
                    <i className="fa fa-walking mr-1 text-neutral-500"></i>
                    {formatDistance(distanceInfo.distance)}
                  </div>
                  <div className="flex items-center text-sm text-neutral-700">
                    <i className="fa fa-clock mr-1 text-neutral-500"></i>
                    {distanceInfo.time} min
                  </div>
                </div>
              </div>
            )}
            {nextCourse && (
              <div className="mt-2 border-t border-neutral-200 pt-2">
                <div className="text-sm font-medium text-neutral-700">
                  Next Class
                </div>
                <div className="text-sm text-neutral-600">
                  Room {nextCourse.classroomId === 1 ? "302" : "101"}
                </div>
                <div className="text-xs text-neutral-500">
                  {nextCourse.name} ({getTimeUntilClass()})
                </div>
              </div>
            )}
            {userLocation && distanceInfo && (
              <div className="mt-2 border-t border-neutral-200 pt-2">
                <div className="text-sm font-medium text-neutral-700">
                  Your Location
                </div>
                <div className="text-sm text-neutral-600">
                  {`Lat: ${userLocation[0].toFixed(
                    4
                  )}, Lng: ${userLocation[1].toFixed(4)}`}
                </div>
                <div className="text-sm text-neutral-600">
                  {`Distance: ${formatDistance(distanceInfo.distance)}`}
                </div>
                <div className="text-xs text-neutral-500">
                  {`Time: ${distanceInfo.time} min`}
                </div>
              </div>
            )}{" "}
            <div className="flex justify-end mt-3 border-t border-neutral-200 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 text-primary font-medium flex items-center gap-1"
                onClick={() => {
                  if (userLocation) {
                    // Open in Google Maps
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${building.latitude},${building.longitude}&travelmode=walking`;
                    window.open(url, "_blank");
                  }
                }}
              >
                <Navigation className="h-3 w-3 mr-1" />
                Get Directions
              </Button>
            </div>
            {/* Distance calculator between buildings */}
            {buildings && buildings.length > 1 && (
              <DirectionsCalculator
                buildings={buildings}
                originBuilding={building}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
