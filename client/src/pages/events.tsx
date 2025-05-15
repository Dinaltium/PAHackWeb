import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import EventItem from "@/components/events/EventItem";
import EventForm from "@/components/events/EventForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function EventsPage() {
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events', filterDate ? { date: filterDate } : {}],
  });

  const filteredEvents = events?.filter(event => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pinnedEvents = filteredEvents?.filter(event => event.isPinned);
  const regularEvents = filteredEvents?.filter(event => !event.isPinned);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-md sidebar overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-neutral-800">Events</h1>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-64"
              />
            </div>
            
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterDate("")}>
                    All Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDate(todayStr)}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDate(format(addDays(new Date(), 1), "yyyy-MM-dd"))}>
                    Tomorrow
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDate(format(addDays(new Date(), 7), "yyyy-MM-dd"))}>
                    Next Week
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to add a new event to your schedule.
                    </DialogDescription>
                  </DialogHeader>
                  <EventForm onSuccess={() => setShowEventDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {filterDate && (
          <div className="mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm text-neutral-600">
              Showing events for: {format(new Date(filterDate), "EEEE, MMMM d, yyyy")}
            </span>
            <Button 
              variant="link" 
              className="text-sm ml-2 p-0 h-auto" 
              onClick={() => setFilterDate("")}
            >
              Clear filter
            </Button>
          </div>
        )}
        
        {/* Pinned Events */}
        {pinnedEvents && pinnedEvents.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-accent">Pinned Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pinnedEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Regular Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {filterDate ? "Events" : "All Events"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regularEvents && regularEvents.length > 0 ? (
              <div className="space-y-4">
                {regularEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-10 w-10 text-neutral-400" />
                <h3 className="mt-4 text-lg font-medium">No Events Found</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  {searchQuery ? 
                    "No events match your search criteria." : 
                    filterDate ? 
                      "No events scheduled for this date." : 
                      "You don't have any events scheduled."}
                </p>
                <Button className="mt-4" onClick={() => setShowEventDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
