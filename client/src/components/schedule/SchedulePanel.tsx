import { Calendar, Clock, Info, Navigation } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course, Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function SchedulePanel() {
  const [quickEventName, setQuickEventName] = useState("");
  const [quickEventTime, setQuickEventTime] = useState("");
  const { toast } = useToast();
  
  const todayDateStr = format(new Date(), "yyyy-MM-dd");
  const todayFormatted = format(new Date(), "EEEE, MMMM d");
  
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events', { date: todayDateStr }],
  });

  const handleQuickAddEvent = async () => {
    if (!quickEventName || !quickEventTime) {
      toast({
        title: "Missing information",
        description: "Please provide both event name and time",
        variant: "destructive",
      });
      return;
    }

    try {
      const newEvent = {
        title: quickEventName,
        buildingId: 4, // Student Center for demo
        roomIdentifier: "Main Hall",
        date: todayDateStr,
        startTime: quickEventTime,
        endTime: "", // Optional
        description: "Quick added event",
        isPinned: false,
        createdBy: 1, // Demo user ID
      };

      await apiRequest("POST", "/api/events", newEvent);
      
      toast({
        title: "Event added",
        description: "Your event has been successfully added to your schedule",
      });

      // Reset form
      setQuickEventName("");
      setQuickEventTime("");
      
      // Refresh events data
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    } catch (error) {
      toast({
        title: "Error adding event",
        description: "There was a problem adding your event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="hidden md:block p-4 md:p-6 bg-white shadow-md mx-4 my-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral-800">Today's Schedule</h2>
        <div className="flex space-x-2">
          <span className="text-sm text-neutral-600 font-medium">{todayFormatted}</span>
          <button className="text-primary hover:text-blue-700 transition">
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Classes */}
        <div>
          <h3 className="text-lg font-medium text-neutral-700 mb-3">Classes</h3>
          
          {courses?.length ? courses.map((course, index) => {
            const isNext = index === 0; // Just for demo purposes
            return (
              <div 
                key={course.id}
                className={`${isNext ? 'bg-blue-50 border-l-4 border-primary' : 'border border-neutral-200'} rounded-lg p-4 mb-3`}
              >
                <div className="flex justify-between">
                  <div className="font-medium text-neutral-800">{course.name}</div>
                  <div className={`${isNext ? 'text-primary' : 'text-neutral-600'} font-medium`}>
                    {course.startTime} - {course.endTime}
                  </div>
                </div>
                <div className="text-sm text-neutral-600">
                  {/* This would be joined with building and classroom data in a real app */}
                  {course.id === 1 ? "Science Building - Room 302" : 
                   course.id === 2 ? "Humanities Center - Room 105" : 
                   "Technology Center - Room 201"}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{course.instructor}</div>
                {isNext && (
                  <div className="text-xs text-neutral-500 mt-1 flex items-center">
                    <Clock className="mr-1 h-3 w-3" /> Starts in 15 minutes
                  </div>
                )}
                <div className="flex justify-between mt-3">
                  <Button variant="link" className="text-primary text-sm p-0 h-auto">
                    <Navigation className="mr-1 h-3 w-3" /> Get Directions
                  </Button>
                  <Button variant="link" className="text-neutral-600 text-sm p-0 h-auto">
                    <Info className="mr-1 h-3 w-3" /> Class Details
                  </Button>
                </div>
              </div>
            );
          }) : (
            <div className="text-neutral-500 text-sm">No classes scheduled for today.</div>
          )}
        </div>
        
        {/* Right column: Events */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-neutral-700">Events</h3>
            <Button variant="link" className="text-sm text-primary p-0 h-auto">
              <span className="mr-1">+</span> Add New
            </Button>
          </div>
          
          {events?.length ? events.map((event) => (
            <div 
              key={event.id}
              className={`${event.isPinned ? 'bg-amber-50 border-l-4 border-accent' : 'border border-neutral-200'} rounded-lg p-4 mb-3`}
            >
              <div className="flex justify-between">
                <div className="font-medium text-neutral-800">{event.title}</div>
                <div className={`${event.isPinned ? 'text-accent' : 'text-neutral-600'} font-medium`}>
                  {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                </div>
              </div>
              <div className="text-sm text-neutral-600">
                {/* This would join with building data in a real app */}
                {event.buildingId === 4 ? "Student Center" : "Main Campus"} - {event.roomIdentifier}
              </div>
              <div className="text-xs text-neutral-500 mt-1">{event.description}</div>
              {event.isPinned && (
                <div className="text-xs text-accent mt-1">📌 Pinned Event</div>
              )}
              <div className="flex justify-between mt-3">
                <Button variant="link" className="text-primary text-sm p-0 h-auto">
                  <Navigation className="mr-1 h-3 w-3" /> Get Directions
                </Button>
                <Button variant="link" className="text-neutral-600 text-sm p-0 h-auto">
                  <Clock className="mr-1 h-3 w-3" /> Reminder
                </Button>
              </div>
            </div>
          )) : (
            <div className="text-neutral-500 text-sm mb-3">No events scheduled for today.</div>
          )}
          
          {/* Quick add form */}
          <div className="mt-4 p-4 bg-neutral-100 rounded-lg">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Quick Add Event</h4>
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                placeholder="Event name"
                className="flex-1 text-sm"
                value={quickEventName}
                onChange={(e) => setQuickEventName(e.target.value)}
              />
              <Input
                type="time"
                className="w-24 text-sm"
                value={quickEventTime}
                onChange={(e) => setQuickEventTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleQuickAddEvent}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
