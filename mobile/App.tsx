import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import LogBox from "./src/utils/LogBoxFallback";
import Navigation from "./src/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OfflineProvider } from "./src/contexts/OfflineContext";
import React, { ReactNode } from "react";

// Create a client
const queryClient = new QueryClient();

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  "Warning: Failed prop type",
  "VirtualizedLists should never be nested",
]);

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error?.toString()}</h1>;
    }

    return this.props.children;
  }
}

// Wrap the App component with ErrorBoundary
export default function App() {
  // Load any necessary resources here, like fonts
  useEffect(() => {
    // You could load custom fonts or other resources here
    console.log("PA College Campus Map Mobile App launched");
  }, []);

  console.log("App component rendered");
  console.log("QueryClient initialized:", queryClient);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <OfflineProvider>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </OfflineProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
