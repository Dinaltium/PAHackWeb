import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import LogBox from "./src/utils/LogBoxFallback";
import Navigation from "./src/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OfflineProvider } from "./src/contexts/OfflineContext";

// Create a client
const queryClient = new QueryClient();

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  "Warning: Failed prop type",
  "VirtualizedLists should never be nested",
]);

export default function App() {
  // Load any necessary resources here, like fonts
  useEffect(() => {
    // You could load custom fonts or other resources here
    console.log("PA College Campus Map Mobile App launched");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </OfflineProvider>
    </QueryClientProvider>
  );
}
