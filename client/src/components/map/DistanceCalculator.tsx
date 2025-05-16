import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDistance,
  calculateDistance,
  calculateWalkingTime,
} from "@/lib/mapUtils";
import { CAMPUS_POIS } from "@/types";

interface DistanceCalculatorProps {
  onClose: () => void;
}

export default function DistanceCalculator({
  onClose,
}: DistanceCalculatorProps) {
  const [startPoint, setStartPoint] = useState<string | null>(null);
  const [endPoint, setEndPoint] = useState<string | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: number;
    time: number;
  } | null>(null);

  // Calculate distance when both points are selected
  useEffect(() => {
    if (startPoint && endPoint) {
      const start = CAMPUS_POIS.find((poi) => poi.name === startPoint);
      const end = CAMPUS_POIS.find((poi) => poi.name === endPoint);

      if (start && end) {
        const distance = calculateDistance(
          start.coordinates.latitude,
          start.coordinates.longitude,
          end.coordinates.latitude,
          end.coordinates.longitude
        );

        const time = calculateWalkingTime(distance);

        setDistanceInfo({ distance, time });
      }
    } else {
      setDistanceInfo(null);
    }
  }, [startPoint, endPoint]);

  const handleNavigate = () => {
    if (!startPoint || !endPoint) return;

    const start = CAMPUS_POIS.find((poi) => poi.name === startPoint);
    const end = CAMPUS_POIS.find((poi) => poi.name === endPoint);

    if (start && end) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${start.coordinates.latitude},${start.coordinates.longitude}&destination=${end.coordinates.latitude},${end.coordinates.longitude}&travelmode=walking`;
      window.open(url, "_blank");
    }
  };
  return (
    <Card className="shadow-lg w-[300px] map-marker-card">
      <div className="border-b border-neutral-200 bg-primary/10 p-2 rounded-t-lg flex justify-between items-center">
        <div className="font-semibold text-neutral-800 flex items-center gap-2">
          <i className="fa fa-ruler-combined"></i>
          Distance Calculator
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <i className="fa fa-times text-sm"></i>
        </Button>
      </div>{" "}
      <CardContent className="p-3">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1 text-neutral-700">
              <i className="fa fa-map-marker-alt mr-1 text-primary"></i> Start
              Point
            </label>
            <select
              className="w-full text-sm border border-neutral-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={startPoint || ""}
              onChange={(e) => setStartPoint(e.target.value || null)}
            >
              <option value="">Select starting point</option>
              {CAMPUS_POIS.map((poi) => (
                <option key={`start-${poi.name}`} value={poi.name}>
                  {poi.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1 text-neutral-700">
              <i className="fa fa-flag-checkered mr-1 text-primary"></i> End
              Point
            </label>
            <select
              className="w-full text-sm border border-neutral-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={endPoint || ""}
              onChange={(e) => setEndPoint(e.target.value || null)}
              disabled={!startPoint}
            >
              <option value="">Select destination</option>
              {CAMPUS_POIS.filter((poi) => poi.name !== startPoint).map(
                (poi) => (
                  <option key={`end-${poi.name}`} value={poi.name}>
                    {poi.name}
                  </option>
                )
              )}
            </select>
          </div>{" "}
          {distanceInfo && (
            <div className="mt-3 bg-primary/5 p-3 rounded-md border border-primary/10">
              <h4 className="text-sm font-medium text-primary mb-2">Result:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center text-sm bg-white/80 p-1.5 rounded-md">
                  <i className="fa fa-walking mr-1 text-primary"></i>
                  {formatDistance(distanceInfo.distance)}
                </div>
                <div className="flex items-center text-sm bg-white/80 p-1.5 rounded-md">
                  <i className="fa fa-clock mr-1 text-primary"></i>
                  {distanceInfo.time} min
                </div>
              </div>

              <Button
                onClick={handleNavigate}
                className="mt-2.5 w-full h-9 text-sm bg-primary hover:bg-primary/90"
                size="sm"
              >
                <i className="fa fa-directions mr-1.5"></i> Get Directions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
