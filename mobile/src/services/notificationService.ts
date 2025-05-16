import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Storage key for notification settings
const NOTIFICATION_SETTINGS_KEY = "notification_settings";

// Notification service
export default class NotificationService {
  // Request notification permissions
  static async requestPermissions() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#3B82F6",
      });
    }

    return true;
  }

  // Schedule a class reminder notification
  static async scheduleClassReminder(
    classId: string,
    title: string,
    body: string,
    location: string,
    startTime: Date,
    reminderMinutes: number = 15
  ) {
    const hasPermission = await this.requestPermissions();

    if (!hasPermission) {
      console.log("No notification permission");
      return null;
    }

    // Calculate trigger time (minutes before class starts)
    const triggerTime = new Date(startTime);
    triggerTime.setMinutes(triggerTime.getMinutes() - reminderMinutes);

    // Don't schedule if the time is in the past
    if (triggerTime <= new Date()) {
      console.log("Cannot schedule notification for past time");
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${title}`,
          body: `Starting in ${reminderMinutes} minutes at ${location}`,
          data: { classId },
        },
        trigger: {
          date: triggerTime,
        },
      });

      // Save notification details for management
      await this.saveNotificationSetting(classId, {
        id: notificationId,
        title,
        location,
        startTime: startTime.toISOString(),
        reminderMinutes,
        enabled: true,
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  }
  // Cancel a scheduled notification
  static async cancelNotification(classId: string) {
    try {
      const settings = await this.getNotificationSettings();
      const classNotification = settings[classId];

      if (!classNotification) {
        return false;
      }

      // Handle single notification ID
      if (classNotification.id) {
        await Notifications.cancelScheduledNotificationAsync(
          classNotification.id
        );
      }

      // Handle multiple notification IDs (for recurring notifications)
      if (classNotification.ids && Array.isArray(classNotification.ids)) {
        for (const notificationId of classNotification.ids) {
          try {
            await Notifications.cancelScheduledNotificationAsync(
              notificationId
            );
          } catch (error) {
            console.warn(
              `Error canceling notification ${notificationId}:`,
              error
            );
          }
        }
      }

      // Update settings
      classNotification.enabled = false;
      await this.saveNotificationSetting(classId, classNotification);
      return true;
    } catch (error) {
      console.error("Error canceling notification:", error);
      return false;
    }
  }

  // Get notification settings for all classes
  static async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error("Error getting notification settings:", error);
      return {};
    }
  }

  // Save notification setting for a class
  static async saveNotificationSetting(classId: string, setting: any) {
    try {
      const settings = await this.getNotificationSettings();
      settings[classId] = setting;
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving notification setting:", error);
    }
  }

  // Check if notifications are enabled for a class
  static async isNotificationEnabled(classId: string) {
    try {
      const settings = await this.getNotificationSettings();
      return settings[classId]?.enabled || false;
    } catch (error) {
      console.error("Error checking notification status:", error);
      return false;
    }
  }
}
