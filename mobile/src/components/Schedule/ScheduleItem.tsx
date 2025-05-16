import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotificationService from "../../services/notificationService";

interface ScheduleItemProps {
  item: {
    id: string;
    title: string;
    location: string;
    room?: string;
    startTime: string;
    endTime: string;
    type: "class" | "event" | "break";
    daysOfWeek?: string;
    date?: string;
  };
}

export default function ScheduleItem({ item }: ScheduleItemProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Check if notification is enabled for this class
  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (item.type === "class") {
        const isEnabled = await NotificationService.isNotificationEnabled(
          item.id
        );
        setNotificationEnabled(isEnabled);
      }
    };

    checkNotificationStatus();
  }, [item.id, item.type]);
  // Handle notification toggle
  const handleNotificationToggle = async (value: boolean) => {
    try {
      if (value) {
        // Request permissions first
        const hasPermission = await NotificationService.requestPermissions();
        if (!hasPermission) {
          // If no permission, show an alert or toast
          Alert.alert(
            "Permission Required",
            "Notification permission is required to set reminders.",
            [{ text: "OK" }]
          );
          return;
        }

        // Parse time strings to create Date object
        const [hours, minutes] = item.startTime.split(":").map(Number); // Create a Date object for today with the class time
        const classTime = new Date();
        classTime.setHours(hours, minutes, 0);

        let notificationId; // If the class has days of week, use recurring notifications
        if (item.daysOfWeek) {
          // Import the recurring notification methods
          const recurringModule = await import(
            "../../services/recurring-notification-methods"
          );

          // Use the scheduleRecurringClassReminder method from the default export
          notificationId =
            await recurringModule.default.scheduleRecurringClassReminder(
              item.id,
              item.title,
              `Your class is about to start`,
              item.location + (item.room ? `, Room ${item.room}` : ""),
              classTime,
              item.daysOfWeek,
              15 // 15 minutes before
            );
        } else {
          // For one-time classes, use the regular notification
          notificationId = await NotificationService.scheduleClassReminder(
            item.id,
            item.title,
            `Your class is about to start`,
            item.location + (item.room ? `, Room ${item.room}` : ""),
            classTime,
            15 // 15 minutes before
          );
        }

        if (!notificationId) {
          Alert.alert(
            "Notification Error",
            "Could not schedule the reminder. The class time might be in the past.",
            [{ text: "OK" }]
          );
          return;
        }
      } else {
        // If toggle is off, cancel notification
        await NotificationService.cancelNotification(item.id);
      }
      setNotificationEnabled(value);
    } catch (error) {
      console.error("Error toggling notification:", error);
      Alert.alert(
        "Notification Error",
        "There was a problem setting up the notification. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Get background color based on item type
  const getBackgroundColor = () => {
    switch (item.type) {
      case "class":
        return "#f0f7ff"; // Light blue
      case "event":
        return "#fef3f2"; // Light red
      case "break":
        return "#f3f4f6"; // Light gray
      default:
        return "#f9fafb";
    }
  };

  // Get icon based on item type
  const getIcon = () => {
    switch (item.type) {
      case "class":
        return "school-outline";
      case "event":
        return "calendar-outline";
      case "break":
        return "time-outline";
      default:
        return "ellipsis-horizontal-outline";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
    >
      {/* Time column */}
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{item.startTime}</Text>
        <View style={styles.timeLine} />
        <Text style={styles.timeText}>{item.endTime}</Text>
      </View>
      {/* Content column */}{" "}
      <View style={styles.contentColumn}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Ionicons name={getIcon() as any} size={20} color="#666" />
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#888" />
            <Text style={styles.detailText}>
              {item.location}
              {item.room ? `, Room ${item.room}` : ""}
            </Text>
          </View>

          {item.daysOfWeek && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.detailText}>{item.daysOfWeek}</Text>
            </View>
          )}

          {item.date && (
            <View style={styles.detailRow}>
              <Ionicons name="today-outline" size={16} color="#888" />
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
          )}

          {item.type === "class" && (
            <View style={styles.notificationRow}>
              <Ionicons
                name={
                  notificationEnabled
                    ? "notifications"
                    : "notifications-outline"
                }
                size={16}
                color={notificationEnabled ? "#3B82F6" : "#888"}
              />
              <Text style={styles.notificationText}>Remind me</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: "#ddd", true: "#bfdbfe" }}
                thumbColor={notificationEnabled ? "#3B82F6" : "#f4f3f4"}
                style={styles.notificationSwitch}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    overflow: "hidden",
  },
  timeColumn: {
    width: 60,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  timeLine: {
    width: 1,
    flex: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    paddingRight: 8,
  },
  details: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#777",
    marginLeft: 6,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  notificationText: {
    fontSize: 14,
    color: "#777",
    marginLeft: 6,
    flex: 1,
  },
  notificationSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
