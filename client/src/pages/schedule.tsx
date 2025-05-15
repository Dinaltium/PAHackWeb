import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, Event } from "@shared/schema";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import { format, addDays } from "date-fns";
import Sidebar from "@/components/layout/Sidebar";
import EventForm from "@/components/events/EventForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("today");
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");
  
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: todayEvents } = useQuery<Event[]>({
    queryKey: ['/api/events', { date: todayStr }],
  });

  const { data: tomorrowEvents } = useQuery<Event[]>({
    queryKey: ['/api/events', { date: tomorrowStr }],
  });

  return (
    <div className="flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-md sidebar overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">My Schedule</h1>
          
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {format(new Date(), "EEEE, MMMM d")}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{format(new Date(), "yyyy")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-neutral-700 mb-3">Classes</h3>
                    {courses?.length ? (
                      courses.map((course, index) => (
                        <ScheduleItem 
                          key={course.id} 
                          item={course} 
                          type="course" 
                          isNext={index === 0}
                        />
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">No classes scheduled for today.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-neutral-700 mb-3">Events</h3>
                    {todayEvents?.length ? (
                      todayEvents.map((event) => (
                        <ScheduleItem 
                          key={event.id} 
                          item={event} 
                          type="event"
                        />
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">No events scheduled for today.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tomorrow">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {format(addDays(new Date(), 1), "EEEE, MMMM d")}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{format(addDays(new Date(), 1), "yyyy")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-neutral-700 mb-3">Classes</h3>
                    <p className="text-neutral-500 text-sm">No classes scheduled for tomorrow.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-neutral-700 mb-3">Events</h3>
                    {tomorrowEvents?.length ? (
                      tomorrowEvents.map((event) => (
                        <ScheduleItem 
                          key={event.id} 
                          item={event} 
                          type="event"
                        />
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">No events scheduled for tomorrow.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <Clock className="mx-auto h-10 w-10 text-neutral-400" />
                    <h3 className="mt-4 text-lg font-medium">Calendar View Coming Soon</h3>
                    <p className="mt-2 text-sm text-neutral-500">
                      We're working on a calendar view for your upcoming schedule.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setShowEventDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Future Event
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
