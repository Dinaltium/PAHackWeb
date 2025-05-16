import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// Components
import ScheduleItem from "../components/Schedule/ScheduleItem";

// Dummy data for schedule
const SCHEDULE_DATA = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    location: "Computer Science Block",
    room: "CS101",
    startTime: "09:00",
    endTime: "10:30",
    type: "class",
    daysOfWeek: "Mon, Wed, Fri",
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    location: "Computer Science Block",
    room: "CS102",
    startTime: "11:00",
    endTime: "12:30",
    type: "class",
    daysOfWeek: "Tue, Thu",
  },
  {
    id: "3",
    title: "Lunch Break",
    location: "Cafeteria",
    startTime: "12:30",
    endTime: "13:30",
    type: "break",
    daysOfWeek: "Mon-Fri",
  },
  {
    id: "4",
    title: "Database Systems",
    location: "Engineering Block",
    room: "ENG201",
    startTime: "14:00",
    endTime: "15:30",
    type: "class",
    daysOfWeek: "Mon, Wed",
  },
  {
    id: "5",
    title: "Career Fair",
    location: "PACE Auditorium",
    startTime: "10:00",
    endTime: "16:00",
    date: "May 20, 2025",
    type: "event",
  },
];

// Day filter tabs
const DAYS = [
  { id: "all", label: "All" },
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
];

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState("all");

  // Filter schedule based on selected day
  const filteredSchedule = SCHEDULE_DATA.filter((item) => {
    if (selectedDay === "all") return true;

    // For event type items (special events, not regular classes)
    if (item.type === "event") return true;

    // For regular schedule items
    return (
      item.daysOfWeek && item.daysOfWeek.toLowerCase().includes(selectedDay)
    );
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Day selector tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DAYS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedDay === item.id ? styles.selectedTab : null,
              ]}
              onPress={() => setSelectedDay(item.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedDay === item.id ? styles.selectedTabText : null,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Schedule list */}
      {filteredSchedule.length > 0 ? (
        <FlatList
          data={filteredSchedule}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ScheduleItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No events scheduled for this day</Text>
        </View>
      )}

      {/* Add button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabsContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  selectedTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedTabText: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
