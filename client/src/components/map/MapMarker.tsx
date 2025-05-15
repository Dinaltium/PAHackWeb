import { Building } from "@shared/schema";
import { MapPin, Info, Navigation } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MapMarkerProps {
  building: Building;
  onClose: () => void;
}

export default function MapMarker({ building, onClose }: MapMarkerProps) {
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Find next class in this building if any
  const nextCourse = courses?.find(course => {
    const classroom = course.classroomId; // In a real app, join with classroom data to check building
    return classroom === 1; // Hardcoded for demo to match Science Building
  });

  const getTimeUntilClass = () => {
    if (!nextCourse) return null;
    
    // For demo purposes, just return "15 min"
    return "15 min";
  };

  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
          <MapPin className="h-4 w-4" />
        </div>
        <Card className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 shadow-lg w-48">
          <CardContent className="p-3">
            <div className="font-semibold text-neutral-800">{building.name}</div>
            {nextCourse && (
              <>
                <div className="text-sm text-neutral-600">Room {nextCourse.classroomId === 1 ? "302" : "101"}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  Your next class: {nextCourse.name} ({getTimeUntilClass()})
                </div>
              </>
            )}
            <div className="flex justify-between mt-2">
              <Button 
                variant="link" 
                className="text-xs p-0 h-auto text-primary font-medium"
                onClick={onClose}
              >
                <Info className="h-3 w-3 mr-1" />
                Details
              </Button>
              <Button 
                variant="link" 
                className="text-xs p-0 h-auto text-primary font-medium"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
