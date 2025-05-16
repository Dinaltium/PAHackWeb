import { Building } from "@shared/schema";
import {
  formatDistance,
  calculateDistance,
  calculateWalkingTime,
} from "@/lib/mapUtils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

interface DirectionsCalculatorProps {
  buildings: Building[];
  originBuilding: Building;
}

export default function DirectionsCalculator({
  buildings,
  originBuilding,
}: DirectionsCalculatorProps) {
  const [selectedDestination, setSelectedDestination] = useState<number | null>(
    null
  );

  // Calculate distance between the origin building and the selected destination
  const routeInfo = useMemo(() => {
    if (!selectedDestination) return null;

    const destinationBuilding = buildings.find(
      (b) => b.id === selectedDestination
    );
    if (!destinationBuilding) return null;

    const distance = calculateDistance(
      parseFloat(originBuilding.latitude),
      parseFloat(originBuilding.longitude),
      parseFloat(destinationBuilding.latitude),
      parseFloat(destinationBuilding.longitude)
    );

    const time = calculateWalkingTime(distance);

    return {
      distance,
      time,
      destinationBuilding,
    };
  }, [selectedDestination, buildings, originBuilding]);

  const handleNavigate = () => {
    if (!routeInfo) return;

    // Open in Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originBuilding.latitude},${originBuilding.longitude}&destination=${routeInfo.destinationBuilding.latitude},${routeInfo.destinationBuilding.longitude}&travelmode=walking`;
    window.open(url, "_blank");
  };

  return (
    <div className="mt-3 border-t border-neutral-200 pt-3">
      <Label className="text-sm font-medium text-blue-600 flex items-center mb-2">
        <i className="fa fa-directions mr-1"></i> Calculate Route to:
      </Label>

      <Select onValueChange={(value) => setSelectedDestination(Number(value))}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Select destination" />
        </SelectTrigger>
        <SelectContent>
          {buildings
            .filter((b) => b.id !== originBuilding.id)
            .map((building) => (
              <SelectItem
                key={building.id}
                value={building.id.toString()}
                className="text-sm"
              >
                {building.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {routeInfo && (
        <div className="mt-2 bg-blue-50 p-2 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm font-medium">
              <i className="fa fa-walking mr-1 text-blue-500"></i>
              {formatDistance(routeInfo.distance)}
            </div>
            <div className="flex items-center text-sm font-medium">
              <i className="fa fa-clock mr-1 text-blue-500"></i>
              {routeInfo.time} min walk
            </div>
          </div>

          <Button
            onClick={handleNavigate}
            className="mt-2 w-full h-8 text-sm"
            variant="outline"
          >
            <i className="fa fa-map-marked-alt mr-1"></i> Navigate
          </Button>
        </div>
      )}
    </div>
  );
}
