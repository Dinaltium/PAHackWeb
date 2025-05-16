import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building } from "@shared/schema";
import Sidebar from "@/components/layout/Sidebar";
// Import the simplified map view instead of the normal one
import SimplifiedMapView from "@/components/map/SimplifiedMapView";
import ScheduleDrawer from "@/components/schedule/ScheduleDrawer";
import WelcomeCard from "@/components/WelcomeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { MapProviderProvider } from "@/hooks/useMapProvider";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [showWelcome, setShowWelcome] = useState(false);
  // Check if this is the first visit
  useEffect(() => {
    // Slight delay to ensure the map loads first
    const timer = setTimeout(() => {
      const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
      if (!hasVisitedBefore) {
        setShowWelcome(true);
      }
    }, 2000); // Show welcome after 2 seconds for better map loading

    return () => clearTimeout(timer);
  }, []);

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !buildings) return;

    // Find matching building
    const foundBuilding = buildings.find(
      (building) =>
        building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        building.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundBuilding) {
      setSelectedBuilding(foundBuilding);
    }
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("hasVisitedBefore", "true");
  };

  return (
    <MapProviderProvider>
      {showWelcome && <WelcomeCard onDismiss={handleDismissWelcome} />}
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:block w-64 bg-white shadow-md sidebar overflow-y-auto"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-4 z-10 md:relative md:top-0 md:left-0 md:mx-4 md:mt-4">
            <div className="bg-white rounded-lg shadow-md p-2 w-full md:max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for locations, classes, events..."
                  className="w-full pl-10 pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-2"
                  variant="ghost"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>{" "}
          {/* Map Component */}
          <SimplifiedMapView
            onMarkerSelect={setSelectedBuilding}
            selectedBuilding={selectedBuilding}
          />
          {/* Mobile Schedule Drawer */}
          <ScheduleDrawer />
        </main>
      </div>
    </MapProviderProvider>
  );
}
