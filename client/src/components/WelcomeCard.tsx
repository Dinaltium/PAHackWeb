import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
      description: "Your campus navigation companion. Find buildings, classrooms, and events quickly and easily."
    },
    {
      title: "Interactive Campus Map",
      description: "Explore the campus map with interactive building markers and navigation assistance."
    },
    {
      title: "Event & Class Schedule",
      description: "Keep track of classes and events with personalized schedules and reminders."
    }
  ];

  // Cycle through features
  useEffect(() => {
    if (showFeaturesCount < features.length - 1 && !dismissed) {
      const timer = setTimeout(() => {
        setShowFeaturesCount(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeaturesCount, dismissed, features.length]);  // Animation for dismiss
  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => onDismiss(), 300); // Wait for animation to finish
  };

  const currentFeature = features[showFeaturesCount];  return (
    <div className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${dismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
         style={{ maxWidth: '90vw' }}>
      <Card className={`w-[350px] transition-all duration-300 shadow-xl border border-neutral-200 ${dismissed ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>        <CardHeader className="relative pb-2">
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors"
            aria-label="Close welcome"
          >
            ×
          </button>
          <CardTitle className="text-lg font-medium">{currentFeature.title}</CardTitle>
          <CardDescription className="text-sm mt-1">{currentFeature.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-2">
          <div className="flex space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === showFeaturesCount ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleDismiss}>
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
