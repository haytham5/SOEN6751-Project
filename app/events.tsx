import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
import OfflineBanner from "./components/offlineBanner";
import { getReports, Report } from "./data/reportSH";
import { styles } from "./styles/eventsStyles";

interface RowProps {
  acc: string;
  date: string;
}

type Event = {
  id: number;
  title: string;
  acc: string;
  type: string;
  date: string;
  floor: string;
  location: string;
  time: string;
};

// TODO:
// - calendar events are only from reputable sources

export default function Events() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoading] = useState(true);

  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const [events, setEvents] = useState<Record<string, Event[]>>({
    "2026-02-25": [
      {
        id: 1,
        title: "Protest Spotted",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "1",
        date: "2026-03-25",
        time: "12:00pm",
      },
      {
        id: 2,
        title: "Elevators Out of Order",
        acc: "LB",
        location: "LB",
        floor: "2",
        type: "maintenance",
        date: "2026-03-25",
        time: "2:00pm",
      },
    ],
    "2026-03-26": [
      {
        id: 1,
        title: "Protest Seen",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "3",
        date: "2026-03-26",
        time: "11:00am",
      },
    ],
  });

  useEffect(() => {
    async function loadReports() {
      const data = await getReports();
      setReports(data);
      setLoading(false);
    }

    loadReports();
  }, []);

  useEffect(() => {
    const newEvents: Record<string, Event[]> = {};

    reports.forEach((report) => {
      if (!newEvents[report.date]) {
        newEvents[report.date] = [];
      }

      newEvents[report.date].push({
        id: newEvents[report.date].length + 1,
        title: report.name,
        acc: report.building,
        type: report.type,
        date: report.date,
        floor: report.floor,
        location: report.building,
        time: report.time,
      });
    });

    setEvents((prev) => ({
      ...prev,
      ...newEvents,
    }));
  }, [reports]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const colorMap: Record<string, string> = {
    EV: "#E98A8A",
    LB: "#84D9A1",
  };

  const markedDates = Object.keys(events).reduce(
    (acc: Record<string, any>, date: string) => {
      acc[date] = {
        marked: true,
        dots: events[date].map((e) => ({
          key: e.id.toString(),
          color: colorMap[e.location],
        })),
      };

      return acc;
    },
    {},
  );

  reports.forEach((report) => {
    if (!markedDates[report.date]) {
      markedDates[report.date] = { dots: [] };
    }

    const colorMap = {
      protest: "#FF6B6B",
      event: "#4D96FF",
      accessibility: "#6BCB77",
    };

    markedDates[report.date].dots.push({
      key: report.id,
      color: colorMap[report.type],
    });
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: "#276389",
    };
  }

  const selectedEvents = (events[selectedDate] || []).filter((event) =>
    selectedBuildings.length > 0
      ? selectedBuildings.includes(event.location)
      : true,
  );

  if (!fontsLoaded || loadingReports) {
    return null;
  }

  console.log("Selected:", selectedDate);
  console.log("Events:", events[selectedDate]);

  return (
    <SafeAreaView style={styles.background}>
    <OfflineBanner />
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <FlatList
        data={selectedEvents}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollableContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Your Events</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventLegends}
            >
              {Object.keys(colorMap).map((building) => (
                <TouchableOpacity
                  key={building}
                  activeOpacity={0.9}
                  onPress={() =>
                    setSelectedBuildings(
                      (prev) =>
                        prev.includes(building)
                          ? prev.filter((b) => b !== building) // deselect if already selected
                          : [...prev, building], // add if not selected
                    )
                  }
                >
                  <View
                    style={[
                      styles.subCard,
                      selectedBuildings.includes(building)
                        ? { backgroundColor: colorMap[building] }
                        : styles.unsubbed,
                    ]}
                  >
                    <Text style={styles.subBody}>{building}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Calendar
              markingType={"multi-dot"}
              markedDates={markedDates}
              onDayPress={(day) => setSelectedDate(day.dateString)}
            />
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity // ← wraps the whole bubble
            activeOpacity={0.9}
            onPress={() => setSelectedEvent(item)}
          >
            <View
              style={[
                styles.notification,
                {
                  backgroundColor: colorMap[item.location],
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  padding: 10,
                },
              ]}
            >
              <Text
                style={[
                  styles.notificationBody,
                  { marginVertical: "auto", fontSize: 22 },
                ]}
              >
                <Text style={styles.bold}>
                  {item.location}
                  {item.floor}
                </Text>
              </Text>

              <View
                style={[
                  styles.notification,
                  {
                    flexDirection: "column",
                    padding: 0,
                    marginBottom: 0,
                    marginLeft: 10,
                  },
                ]}
              >
                <Text style={styles.notificationBody}>{item.title}</Text>
                <Text style={{ fontStyle: "italic", fontSize: 10 }}>
                  {item.time}
                </Text>
              </View>
            </View>
          </TouchableOpacity> // ← closes the wrapper
        )}
      />
      <Modal
        visible={selectedEvent !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedEvent(null)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedEvent(null)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalBuilding}>
                  {selectedEvent.location} — Floor {selectedEvent.floor}
                </Text>

                <Text style={styles.modalTime}>{selectedEvent.time}</Text>
                <Text style={styles.modalDescription}>
                  {selectedEvent.date}
                </Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
      <BottomNav />
    </SafeAreaView>
  );
}
