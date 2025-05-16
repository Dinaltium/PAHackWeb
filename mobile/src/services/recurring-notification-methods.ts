// Recurring notification methods for the PA College Campus Map app
import * as Notifications from "expo-notifications";
import NotificationService from "./notificationService";

// Helper method to get the next date for a specific day of the week
function getNextDayOfWeek(dayOfWeek: number): Date {
  const today = new Date();
  const todayDayOfWeek = today.getDay();

  // Calculate days to add
  let daysToAdd = dayOfWeek - todayDayOfWeek;
  if (daysToAdd <= 0) {
    // If the day has already passed this week, get next week's occurrence
    daysToAdd += 7;
  }

  // Create new date
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToAdd);
  return nextDate;
}

// Schedule recurring class reminders for multiple days of the week
async function scheduleRecurringClassReminder(
  classId: string,
  title: string,
  body: string,
  location: string,
  startTime: Date,
  daysOfWeek: string,
  reminderMinutes: number = 15
) {
  const hasPermission = await NotificationService.requestPermissions();

  if (!hasPermission) {
    console.log("No notification permission");
    return null;
  }

  // Parse days of week string (e.g., "Mon, Wed, Fri")
  const days = daysOfWeek.split(",").map((day) => day.trim().toLowerCase());

  // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMappings: Record<string, number> = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tues: 2,
    tuesday: 2,
    wed: 3,
    wednesday: 3,
    thu: 4,
    thur: 4,
    thurs: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
  };
  // Create an array of notification IDs for all scheduled reminders
  const notificationIds: string[] = [];

  try {
    // For each day of the week this class occurs
    for (const day of days) {
      const dayNumber = dayMappings[day];

      if (dayNumber !== undefined) {
        // Create a date for the next occurrence of this day
        const nextDate = getNextDayOfWeek(dayNumber);

        // Set the time from the startTime
        nextDate.setHours(startTime.getHours());
        nextDate.setMinutes(startTime.getMinutes());
        nextDate.setSeconds(0);

        // Calculate trigger time (minutes before class starts)
        const triggerTime = new Date(nextDate);
        triggerTime.setMinutes(triggerTime.getMinutes() - reminderMinutes);

        // Only schedule if the time is in the future
        if (triggerTime > new Date()) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: `Reminder: ${title}`,
              body: `Starting in ${reminderMinutes} minutes at ${location}`,
              data: { classId, dayOfWeek: day },
            },
            trigger: {
              date: triggerTime,
              // For weekly repeating, we would use this instead:
              // weekday: dayNumber + 1, // Expo uses 1-7 for weekday
              // hour: startTime.getHours(),
              // minute: startTime.getMinutes() - reminderMinutes,
              // repeats: true,
            },
          });

          notificationIds.push(notificationId);
        }
      }
    }
    // Save notification details for management
    if (notificationIds.length > 0) {
      await NotificationService.saveNotificationSetting(classId, {
        ids: notificationIds,
        title,
        location,
        startTime: startTime.toISOString(),
        daysOfWeek,
        reminderMinutes,
        enabled: true,
      });

      return notificationIds;
    }

    return null;
  } catch (error) {
    console.error("Error scheduling recurring notification:", error);
    return null;
  }
}

// Export all methods
export default {
  scheduleRecurringClassReminder,
  getNextDayOfWeek,
};
