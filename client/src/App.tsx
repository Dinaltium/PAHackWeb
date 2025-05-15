import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/index";
import SchedulePage from "@/pages/schedule";
import ClassesPage from "@/pages/classes";
import EventsPage from "@/pages/events";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/schedule" component={SchedulePage} />
      <Route path="/classes" component={ClassesPage} />
      <Route path="/events" component={EventsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [userId] = useState<number>(1); // For demo purposes

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header userId={userId} />
          <Router />
          <BottomNav currentPath={location} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
