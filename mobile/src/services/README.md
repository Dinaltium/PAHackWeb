# Services Documentation for PA College Campus Map

This directory contains service modules that handle various aspects of the application's functionality.

## NotificationService

`notificationService.ts` provides a comprehensive API for managing notifications in the app.

### Key Features:

- Permission management
- Scheduling one-time notifications
- Canceling notifications
- Storing notification settings in AsyncStorage

### Main Methods:

- `requestPermissions()`: Requests notification permissions from the user
- `scheduleClassReminder()`: Schedules a notification for a class
- `cancelNotification()`: Cancels scheduled notifications
- `getNotificationSettings()`: Retrieves all notification settings
- `saveNotificationSetting()`: Saves notification settings to storage
- `isNotificationEnabled()`: Checks if notifications are enabled for a class

## Recurring Notification Methods

`recurring-notification-methods.ts` contains functions specifically for handling recurring notifications.

### Key Features:

- Scheduling notifications for recurring classes (multiple days of the week)
- Day-of-week parsing
- Multi-notification management

### Main Methods:

- `scheduleRecurringClassReminder()`: Schedules notifications for classes on multiple days
- `getNextDayOfWeek()`: Helper to calculate the next occurrence of a specific day

## SyncService

`syncService.ts` manages data synchronization between the app and server.

### Key Features:

- Data syncing between local storage and server
- Supporting offline-first functionality
- Managing sync conflicts

### Main Methods:

- `syncMapData()`: Syncs map data between local storage and server
- `syncScheduleData()`: Syncs class schedule data
- `syncUserPreferences()`: Syncs user preferences and settings

## Usage Examples

### Scheduling a One-time Notification

```typescript
import NotificationService from "../../services/notificationService";

const notificationId = await NotificationService.scheduleClassReminder(
  "class-123",
  "Introduction to Engineering",
  "Your class is about to start",
  "Engineering Building, Room 101",
  classTime, // Date object
  15 // 15 minutes before
);
```

### Scheduling Recurring Notifications

```typescript
import recurringNotifications from "../../services/recurring-notification-methods";

const notificationIds =
  await recurringNotifications.scheduleRecurringClassReminder(
    "class-456",
    "Database Systems",
    "Your class is about to start",
    "Computing Center, Room 302",
    classTime, // Date object
    "Mon, Wed, Fri", // Days of week
    15 // 15 minutes before
  );
```
