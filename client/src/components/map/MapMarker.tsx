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

  // Get icon color based on building type
  const getBuildingIcon = () => {
    switch(building.type) {
      case 'academic': return <i className="fa fa-school text-blue-500"></i>;
      case 'administrative': return <i className="fa fa-building text-indigo-500"></i>; 
      case 'residence': return <i className="fa fa-home text-pink-500"></i>;
      case 'dining': return <i className="fa fa-utensils text-amber-500"></i>;
      case 'recreation': return <i className="fa fa-dumbbell text-emerald-500"></i>;
      case 'library': return <i className="fa fa-book text-purple-500"></i>;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        <div className="w-10 h-10 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-lg">
          <div className="text-lg">{getBuildingIcon()}</div>
        </div>
        <Card className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 shadow-lg w-64">
          <CardContent className="p-3">
            <div className="font-semibold text-neutral-800 flex items-center gap-2">
              {getBuildingIcon()}
              {building.name}
            </div>
            <div className="text-sm text-neutral-600 mt-1">{building.description || 'No description available'}</div>
            {nextCourse && (
              <div className="mt-2 border-t border-neutral-200 pt-2">
                <div className="text-sm font-medium text-neutral-700">Next Class</div>
                <div className="text-sm text-neutral-600">Room {nextCourse.classroomId === 1 ? "302" : "101"}</div>
                <div className="text-xs text-neutral-500">
                  {nextCourse.name} ({getTimeUntilClass()})
                </div>
              </div>
            )}
            <div className="flex justify-between mt-3 border-t border-neutral-200 pt-2">
              <Button 
                variant="outline"
                size="sm"
                className="text-xs h-8 text-primary font-medium flex items-center gap-1"
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
