import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WelcomeCardProps {
  onDismiss: () => void;
}

export default function WelcomeCard({ onDismiss }: WelcomeCardProps) {
  const [showFeaturesCount, setShowFeaturesCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Features to cycle through
  const features = [
    {
      title: "Welcome to PA College of Engineering",
      description:
        "Your campus navigation companion. Find buildings, classrooms, and events quickly and easily.",
    },
    {
      title: "Interactive Campus Map",
      description:
        "Explore the campus map with interactive building markers and navigation assistance.",
    },
    {
      title: "Event & Class Schedule",
      description:
        "Keep track of classes and events with personalized schedules and reminders.",
    },
  ];

  // Cycle through features
  useEffect(() => {
    if (showFeaturesCount < features.length - 1 && !dismissed) {
      const timer = setTimeout(() => {
        setShowFeaturesCount((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeaturesCount, dismissed, features.length]);

  // Animation for dismiss
  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => onDismiss(), 300); // Wait for animation to finish
  };

  // Navigate to a specific feature slide
  const navigateToFeature = (index: number) => {
    setShowFeaturesCount(index);
  };

  const currentFeature = features[showFeaturesCount];
  return (
    <div
      className={`fixed bottom-20 md:bottom-10 right-5 z-40 transition-all duration-300 ${
        dismissed ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ maxWidth: "min(90vw, 400px)" }}
    >
      <Card
        className={`w-full transition-all duration-300 shadow-xl border border-neutral-200 ${
          dismissed ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <CardHeader className="relative pb-2">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors"
            aria-label="Close welcome"
          >
            ×
          </button>
          <CardTitle className="text-lg font-medium">
            {currentFeature.title}
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            {currentFeature.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-2">
          <div className="flex space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                onClick={() => navigateToFeature(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                  index === showFeaturesCount
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 pb-3">
          <div className="flex space-x-2">
            {showFeaturesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToFeature(showFeaturesCount - 1)}
                className="h-8 px-2"
              >
                ← Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            {showFeaturesCount < features.length - 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToFeature(showFeaturesCount + 1)}
                className="h-8 px-2"
              >
                Next →
              </Button>
            ) : (
              <Button size="sm" className="px-4 h-8" onClick={handleDismiss}>
                Got it
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
