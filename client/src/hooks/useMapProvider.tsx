import { createContext, useContext, useState, ReactNode } from "react";

type MapProvider = 'google' | 'apple' | 'leaflet';

interface MapProviderContextType {
  provider: MapProvider;
  setProvider: (provider: MapProvider) => void;
}

const MapProviderContext = createContext<MapProviderContextType | undefined>(undefined);

export function MapProviderProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<MapProvider>('leaflet');

  return (
    <MapProviderContext.Provider value={{ provider, setProvider }}>
      {children}
    </MapProviderContext.Provider>
  );
}

export function useMapProvider() {
  const context = useContext(MapProviderContext);
  if (context === undefined) {
    throw new Error('useMapProvider must be used within a MapProviderProvider');
  }
  return context;
}
