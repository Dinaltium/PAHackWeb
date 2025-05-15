import { Building, Course, Event } from "@shared/schema";
import { Clock, Navigation, Info, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface ScheduleItemProps {
  item: Course | Event;
  type: 'course' | 'event';
  isNext?: boolean;
}

export default function ScheduleItem({ item, type, isNext = false }: ScheduleItemProps) {
  const isCourse = type === 'course';
  const course = isCourse ? item as Course : null;
  const event = !isCourse ? item as Event : null;
  
  const { data: buildings } = useQuery<Building[]>({
    queryKey: ['/api/buildings'],
  });

  const getBuildingName = (id: number) => {
    const building = buildings?.find(b => b.id === id);
    return building ? building.name : "Unknown Building";
  };
  
  const isPinned = event?.isPinned;
  
  // Classes for determining appearance
  const containerClasses = `
    ${isNext ? 'bg-blue-50 border-l-4 border-primary' : 
    isPinned ? 'bg-amber-50 border-l-4 border-accent' : 
    'border border-neutral-200'} 
    rounded-lg p-4 mb-3
  `;
  
  const timeClasses = `
    ${isNext ? 'text-primary' : 
    isPinned ? 'text-accent' : 
    'text-neutral-600'} 
    font-medium
  `;
  
  return (
    <div className={containerClasses}>
      <div className="flex justify-between">
        <div className="font-medium text-neutral-800">
          {isCourse ? course?.name : event?.title}
        </div>
        <div className={timeClasses}>
          {isCourse ? 
            `${course?.startTime} - ${course?.endTime}` : 
            event?.endTime ? `${event?.startTime} - ${event?.endTime}` : event?.startTime
          }
        </div>
      </div>
      
      <div className="text-sm text-neutral-600">
        {isCourse ? 
          `${getBuildingName(1)} - Room ${course?.classroomId}` : 
          `${getBuildingName(event?.buildingId || 1)} - ${event?.roomIdentifier}`
        }
      </div>
      
      <div className="text-xs text-neutral-500 mt-1">
        {isCourse ? course?.instructor : event?.description}
      </div>
      
      {isNext && (
        <div className="text-xs text-neutral-500 mt-1 flex items-center">
          <Clock className="mr-1 h-3 w-3" /> Starts in 15 minutes
        </div>
      )}
      
      {isPinned && (
        <div className="text-xs text-accent mt-1">📌 Pinned Event</div>
      )}
      
      <div className="flex justify-between mt-3">
        <Button variant="link" className="text-primary text-sm p-0 h-auto">
          <Navigation className="mr-1 h-3 w-3" /> Get Directions
        </Button>
        
        <Button variant="link" className="text-neutral-600 text-sm p-0 h-auto">
          {isCourse ? (
            <>
              <Info className="mr-1 h-3 w-3" /> Class Details
            </>
          ) : (
            <>
              <Bell className="mr-1 h-3 w-3" /> Reminder
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
