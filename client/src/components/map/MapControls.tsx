import { Plus, Minus, Navigation2 } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterOnUser: () => void;
}

export default function MapControls({ onZoomIn, onZoomOut, onCenterOnUser }: MapControlsProps) {
  return (
    <div className="absolute bottom-20 md:bottom-4 right-4 flex flex-col space-y-2">
      <button 
        onClick={onZoomIn}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
      >
        <Plus className="h-5 w-5" />
      </button>
      
      <button 
        onClick={onZoomOut}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
      >
        <Minus className="h-5 w-5" />
      </button>
      
      <button 
        onClick={onCenterOnUser}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-neutral-700 hover:bg-neutral-100"
      >
        <Navigation2 className="h-5 w-5" />
      </button>
    </div>
  );
}
