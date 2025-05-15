import { Building, Event } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { MapPin, Calendar, Clock, Pin, Navigation, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EventItemProps {
  event: Event;
}

export default function EventItem({ event }: EventItemProps) {
  const { toast } = useToast();
  
  const { data: buildings } = useQuery<Building[]>({
    queryKey: ['/api/buildings'],
  });

  const building = buildings?.find(b => b.id === event.buildingId);

  const handleDeleteEvent = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await apiRequest("DELETE", `/api/events/${event.id}`);
        
        toast({
          title: "Event deleted",
          description: "The event has been successfully removed from your schedule",
        });
        
        // Refetch events
        queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      } catch (error) {
        toast({
          title: "Error deleting event",
          description: "There was a problem deleting this event",
          variant: "destructive",
        });
      }
    }
  };

  const togglePin = async () => {
    try {
      await apiRequest("PATCH", `/api/events/${event.id}`, {
        isPinned: !event.isPinned
      });
      
      toast({
        title: event.isPinned ? "Event unpinned" : "Event pinned",
        description: event.isPinned 
          ? "The event has been removed from your pinned items" 
          : "The event has been added to your pinned items",
      });
      
      // Refetch events
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    } catch (error) {
      toast({
        title: "Error updating event",
        description: "There was a problem updating this event",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={event.isPinned ? "border-l-4 border-accent" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-neutral-800 text-lg">{event.title}</h3>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-7 w-7 ${event.isPinned ? 'text-accent' : ''}`}
              onClick={togglePin}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive/80"
              onClick={handleDeleteEvent}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-neutral-500 mt-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-neutral-500 mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-neutral-500 mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          <span>
            {building?.name || "Unknown Location"} - {event.roomIdentifier}
          </span>
        </div>
        
        {event.description && (
          <p className="text-sm text-neutral-600 mt-3 border-t pt-2">
            {event.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <Badge variant={event.isPinned ? "outline" : "secondary"} className={event.isPinned ? "text-accent border-accent" : ""}>
            {event.isPinned ? "Pinned" : "Regular"} Event
          </Badge>
          
          <Button size="sm" className="flex items-center">
            <Navigation className="h-3 w-3 mr-1" />
            Navigate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
