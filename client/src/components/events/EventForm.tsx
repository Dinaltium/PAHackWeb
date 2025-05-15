import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Building } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  buildingId: z.coerce.number(),
  roomIdentifier: z.string().min(1, { message: "Room identifier is required" }),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  description: z.string().optional(),
  isPinned: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onSuccess?: () => void;
}

export default function EventForm({ onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { data: buildings } = useQuery<Building[]>({
    queryKey: ['/api/buildings'],
  });

  const defaultValues: FormValues = {
    title: "",
    buildingId: 4, // Default to Student Center
    roomIdentifier: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "12:00",
    endTime: "13:00",
    description: "",
    isPinned: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const eventData = {
        ...data,
        createdBy: 1, // Demo user ID
      };

      await apiRequest("POST", "/api/events", eventData);
      
      toast({
        title: "Event created",
        description: "Your event has been successfully added to your schedule",
      });
      
      // Reset the form
      form.reset(defaultValues);
      
      // Invalidate the query to refetch the events
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error creating event",
        description: "There was a problem creating your event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="buildingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a building" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildings?.map((building) => (
                    <SelectItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="roomIdentifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Room 101, Main Hall, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add event details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPinned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Pin Event</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Pin this event to highlight it on your schedule
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
