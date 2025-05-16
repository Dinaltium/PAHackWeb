import { Plus, Minus, Navigation2, Ruler } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterOnUser: () => void;
  onShowDistanceCalculator: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onCenterOnUser,
  onShowDistanceCalculator,
}: MapControlsProps) {
  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={onZoomIn}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
        aria-label="Zoom in"
      >
        <Plus className="h-5 w-5" />
      </button>

      <button
        onClick={onZoomOut}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
        aria-label="Zoom out"
      >
        <Minus className="h-5 w-5" />
      </button>

      <button
        onClick={onCenterOnUser}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
        aria-label="Center on my location"
      >
        <Navigation2 className="h-5 w-5" />
      </button>

      <button
        onClick={onShowDistanceCalculator}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
        aria-label="Distance calculator"
      >
        <Ruler className="h-5 w-5" />
      </button>
    </div>
  );
}
