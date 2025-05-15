import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building } from "@shared/schema";
import { Clock, MapPin, Calendar, BookOpen, Navigation, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  const { data: buildings } = useQuery<Building[]>({
    queryKey: ['/api/buildings'],
  });

  const getBuildingName = (courseId: number): string => {
    // This would normally join with classroom data to get the building
    if (courseId === 1) return "Science Building";
    if (courseId === 2) return "Humanities Center";
    if (courseId === 3) return "Technology Center";
    return "Unknown Building";
  };

  const getClassroomNumber = (courseId: number): string => {
    if (courseId === 1) return "302";
    if (courseId === 2) return "105";
    if (courseId === 3) return "201";
    return "101";
  };

  const getDaysOfWeekLabel = (daysOfWeek: string): string => {
    return daysOfWeek.split(',').join(', ');
  };

  const getTodayClasses = (): Course[] => {
    if (!courses) return [];
    
    const today = format(new Date(), "EEE").slice(0, 3);
    
    return courses.filter(course => 
      course.daysOfWeek.includes(today)
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-md sidebar overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">My Classes</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Today's Classes</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{format(new Date(), "EEEE, MMMM d")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getTodayClasses().length > 0 ? (
                  <div className="space-y-4">
                    {getTodayClasses().map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{course.name}</h3>
                              <p className="text-sm text-neutral-500">{course.courseCode}</p>
                            </div>
                            <Badge variant="outline" className="text-primary border-primary">
                              {course.startTime} - {course.endTime}
                            </Badge>
                          </div>
                          
                          <div className="mt-3 space-y-1 text-sm text-neutral-600">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-2" />
                              <span>{getBuildingName(course.id)} - Room {getClassroomNumber(course.id)}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-2" />
                              <span>Instructor: {course.instructor}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-3 space-x-2">
                            <Button size="sm" variant="outline">
                              <Info className="h-3 w-3 mr-1" /> Details
                            </Button>
                            <Button size="sm">
                              <Navigation className="h-3 w-3 mr-1" /> Navigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="mx-auto h-10 w-10 text-neutral-400" />
                    <h3 className="mt-4 text-lg font-medium">No Classes Today</h3>
                    <p className="mt-2 text-sm text-neutral-500">
                      You don't have any classes scheduled for today.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Enrolled Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {courses?.length ? (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{course.name}</h3>
                              <p className="text-sm text-neutral-500">{course.courseCode}</p>
                            </div>
                            <Badge variant="outline">
                              {getDaysOfWeekLabel(course.daysOfWeek)}
                            </Badge>
                          </div>
                          
                          <div className="mt-3 space-y-1 text-sm text-neutral-600">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-2" />
                              <span>{course.startTime} - {course.endTime}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-2" />
                              <span>{getBuildingName(course.id)} - Room {getClassroomNumber(course.id)}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-2" />
                              <span>Instructor: {course.instructor}</span>
                            </div>
                          </div>
                          
                          {course.description && (
                            <p className="mt-3 text-sm text-neutral-600 border-t pt-2">
                              {course.description}
                            </p>
                          )}
                          
                          <div className="flex justify-end mt-3 space-x-2">
                            <Button size="sm" variant="outline">
                              <Info className="h-3 w-3 mr-1" /> Details
                            </Button>
                            <Button size="sm">
                              <Navigation className="h-3 w-3 mr-1" /> Navigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="mx-auto h-10 w-10 text-neutral-400" />
                    <h3 className="mt-4 text-lg font-medium">No Classes Found</h3>
                    <p className="mt-2 text-sm text-neutral-500">
                      You are not enrolled in any classes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Class Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <Calendar className="mx-auto h-10 w-10 text-neutral-400" />
                  <h3 className="mt-4 text-lg font-medium">Weekly View Coming Soon</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    We're working on a weekly calendar view for your class schedule.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
