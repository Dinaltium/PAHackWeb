# Notification System for PA College Campus Map

This guide explains how the notification system works in the PA College Campus Map mobile application.

## Overview

The app provides class schedule reminders for students, allowing them to:

- Set reminders for individual classes
- Receive notifications 15 minutes before each class starts
- Get recurring notifications for classes that occur on multiple days of the week

## Key Components

### 1. NotificationService

The `NotificationService` class in `src/services/notificationService.ts` handles:

- Permission management
- Scheduling one-time notifications
- Canceling notifications
- Storing notification settings

### 2. Recurring Notifications

The app supports recurring notifications through the methods in `src/services/recurring-notification-methods.ts`:

- Parses schedule's days of the week (e.g., "Mon, Wed, Fri")
- Creates notifications for each day the class occurs
- Handles proper date calculation for the next occurrence

### 3. ScheduleItem Component

The `ScheduleItem` component in `src/components/Schedule/ScheduleItem.tsx`:

- Displays a toggle switch for enabling/disabling reminders
- Handles user interaction for notification management
- Shows different UI based on notification state
- Provides error feedback if notifications can't be scheduled

## User Flow

1. User views their class schedule
2. User toggles the "Remind me" switch for a class
3. System requests notification permissions if not already granted
4. System schedules notifications based on class schedule:
   - For one-time classes: schedules a single notification
   - For recurring classes: schedules notifications for each day of the week
5. User receives visual confirmation that notifications are enabled
6. User can disable notifications by toggling the switch off

## Error Handling

The system handles several error conditions:

- Notification permissions not granted
- Attempting to schedule notifications for past times
- Device or system constraints
- Network or storage issues

All errors show user-friendly alerts with appropriate guidance.

## Implementation Details

### Notification Storage

Notification settings are stored in AsyncStorage using:

- Key: "notification_settings"
- Value: JSON object mapping class IDs to notification settings

### Future Improvements

1. Add customizable notification times (30 min, 1 hour before class)
2. Implement batch notification management
3. Add calendar integration
4. Support semester-based scheduling (start/end dates)
5. Add notification history and snooze functionality
