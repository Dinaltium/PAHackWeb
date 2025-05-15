import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course, Event } from "@shared/schema";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ScheduleDrawer() {
  const [drawerState, setDrawerState] = useState<'collapsed' | 'expanded'>('collapsed');
  const [startY, setStartY] = useState<number | null>(null);
  const [currentTranslate, setCurrentTranslate] = useState<number>(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const todayDateStr = format(new Date(), "yyyy-MM-dd");
  const todayShortFormat = format(new Date(), "EEE, MMM d");

  const { data: courses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events', { date: todayDateStr }],
  });

  useEffect(() => {
    // Set initial state
    if (drawerRef.current) {
      const height = drawerRef.current.offsetHeight;
      setCurrentTranslate(drawerState === 'collapsed' ? height - 80 : 0);
    }
  }, [drawerState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null || !drawerRef.current) return;
    
    const deltaY = e.touches[0].clientY - startY;
    const height = drawerRef.current.offsetHeight;
    const newTranslate = Math.max(0, Math.min(currentTranslate + deltaY, height - 80));
    
    drawerRef.current.style.transform = `translateY(${newTranslate}px)`;
  };

  const handleTouchEnd = () => {
    if (startY === null || !drawerRef.current) return;
    setStartY(null);
    
    const height = drawerRef.current.offsetHeight;
    let finalTranslate: number;
    
    if (currentTranslate > height / 2) {
      // Collapse drawer
      setDrawerState('collapsed');
      finalTranslate = height - 80;
    } else {
      // Expand drawer
      setDrawerState('expanded');
      finalTranslate = 0;
    }
    
    setCurrentTranslate(finalTranslate);
    drawerRef.current.style.transform = `translateY(${finalTranslate}px)`;
  };

  return (
    <div 
      ref={drawerRef}
      className="md:hidden bg-white shadow-lg rounded-t-xl fixed bottom-16 left-0 right-0 z-20 transform transition-transform duration-300"
      style={{ 
        height: '60vh', 
        transform: `translateY(${currentTranslate}px)`,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-4">
        <div className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-4"></div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-800">Today's Schedule</h2>
          <span className="text-sm text-neutral-500">{todayShortFormat}</span>
        </div>
        
        {/* Schedule items will be shown when drawer is expanded */}
        <div className="mt-4 schedule-content">
          {/* Current/next class */}
          {courses && courses.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-3 mb-3">
              <div className="flex justify-between">
                <div className="font-medium text-neutral-800">{courses[0].name}</div>
                <div className="text-primary font-medium">{courses[0].startTime}</div>
              </div>
              <div className="text-sm text-neutral-600">Science Building - Room 302</div>
              <div className="text-xs text-neutral-500 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Starts in 15 minutes
              </div>
              <Button variant="link" className="mt-2 text-primary text-sm p-0 h-auto flex items-center">
                <i className="fas fa-directions mr-1"></i> Get Directions
              </Button>
            </div>
          )}
          
          {/* Upcoming classes */}
          {courses && courses.slice(1).map((course) => (
            <div key={course.id} className="border border-neutral-200 rounded-lg p-3 mb-3">
              <div className="flex justify-between">
                <div className="font-medium text-neutral-800">{course.name}</div>
                <div className="text-neutral-600 font-medium">{course.startTime}</div>
              </div>
              <div className="text-sm text-neutral-600">
                {course.id === 2 ? "Humanities Center - Room 105" : "Technology Center - Room 201"}
              </div>
            </div>
          ))}
          
          {/* Event */}
          {events && events.map((event) => (
            <div key={event.id} className={`${event.isPinned ? 'bg-amber-50 border-l-4 border-accent' : 'border border-neutral-200'} rounded-lg p-3 mb-3`}>
              <div className="flex justify-between">
                <div className="font-medium text-neutral-800">{event.title}</div>
                <div className={event.isPinned ? 'text-accent font-medium' : 'text-neutral-600 font-medium'}>
                  {event.startTime}
                </div>
              </div>
              <div className="text-sm text-neutral-600">
                {event.buildingId === 4 ? "Student Center" : "Main Campus"} - {event.roomIdentifier}
              </div>
              {event.isPinned && <div className="text-xs text-accent mt-1">📌 Pinned Event</div>}
            </div>
          ))}
          
          <Button className="w-full mt-4" onClick={() => window.location.href = '/events'}>
            <span className="mr-2">+</span> Add Event
          </Button>
        </div>
      </div>
    </div>
  );
}
