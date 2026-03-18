import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import ReportFormModal from "./components/ReportFormModal";

type Event = {
  id: string;
  title: string;
  acc: string;
  type: "protest" | "event" | "accessibility" | "maintenance";
  date: string;
  floor: string;
  location: string;
  time: string;
  description?: string;
};

const buildingNameMap: Record<string, string> = {
  EV: "Engineering and Visual Arts",
  H: "Hall Building",
  JMSB: "JMSB",
  LB: "Main Library",
  FB: "Faubourg Building",
};

const typeLabelMap: Record<string, string> = {
  protest: "High",
  event: "Low",
  accessibility: "Low",
  maintenance: "Low",
};

const typeToneMap: Record<string, "red" | "green"> = {
  protest: "red",
  event: "green",
  accessibility: "green",
  maintenance: "green",
};

const typeDotColorMap: Record<string, string> = {
  protest: "#D9534F",
  event: "#1FA64A",
  accessibility: "#1FA64A",
  maintenance: "#1FA64A",
};

export default function Events() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoading] = useState(true);

  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const [manualEvents] = useState<Record<string, Event[]>>({
    "2026-03-25": [
      {
        id: "manual-1",
        title: "Protest Spotted",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "1",
        date: "2026-03-25",
        time: "12:00pm",
        description:
            "A protest has been reported near the building entrance. Expect delays and heavier pedestrian traffic.",
      },
      {
        id: "manual-2",
        title: "Elevators Out of Order",
        acc: "LB",
        location: "LB",
        floor: "2",
        type: "maintenance",
        date: "2026-03-25",
        time: "2:00pm",
        description:
            "Elevators are temporarily unavailable. Please use an alternate route if needed.",
      },
    ],
    "2026-03-26": [
      {
        id: "manual-3",
        title: "Protest Seen",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "3",
        date: "2026-03-26",
        time: "11:00am",
        description:
            "A protest was seen around the area. Foot traffic may be heavier than usual.",
      },
    ],
  });

  const [selectedDate, setSelectedDate] = useState(
      new Date().toISOString().split("T")[0],
  );

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const loadReports = useCallback(async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.log("error loading reports", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useFocusEffect(
      useCallback(() => {
        loadReports();
      }, [loadReports]),
  );

  const reportEventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};

    reports.forEach((report) => {
      if (!grouped[report.date]) {
        grouped[report.date] = [];
      }

      grouped[report.date].push({
        id: `report-${report.id}`,
        title: report.name || report.type,
        acc: report.building,
        type: report.type,
        date: report.date,
        floor: report.floor,
        location: report.building,
        time: report.time,
        description: report.description || "No description provided.",
      });
    });

    return grouped;
  }, [reports]);

  const allEvents = useMemo(() => {
    const merged: Record<string, Event[]> = { ...manualEvents };

    Object.entries(reportEventsByDate).forEach(([date, reportEvents]) => {
      merged[date] = [...(merged[date] || []), ...reportEvents];
    });

    return merged;
  }, [manualEvents, reportEventsByDate]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    Object.keys(allEvents).forEach((date) => {
      marks[date] = {
        marked: true,
        dots: allEvents[date].map((event) => ({
          key: event.id,
          color: typeDotColorMap[event.type] || "#276389",
        })),
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: "#276389",
      };
    }

    return marks;
  }, [allEvents, selectedDate]);

  const selectedEvents = (allEvents[selectedDate] || []).filter((event) =>
      selectedBuildings.length > 0
          ? selectedBuildings.includes(event.location)
          : true,
  );

  const buildingFilters = ["EV", "LB", "H", "JM", "FB"];

  if (!fontsLoaded || loadingReports) {
    return null;
  }

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
      <SafeAreaView style={styles.background}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

        <FlatList
            data={selectedEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.scrollableContent}
            ListHeaderComponent={
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>Your Events</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  Tap a building to turn notifications on or off.
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.subscriptions}
                >
                  {buildingFilters.map((building) => {
                    const isActive = selectedBuildings.includes(building);

                    return (
                        <TouchableOpacity
                            key={building}
                            activeOpacity={0.9}
                            onPress={() =>
                                setSelectedBuildings((prev) =>
                                    prev.includes(building)
                                        ? prev.filter((b) => b !== building)
                                        : [...prev, building],
                                )
                            }
                        >
                          <View
                              style={[
                                styles.subCard,
                                isActive ? styles.green : styles.unsubbed,
                                isActive ? styles.subCardActive : styles.subCardInactive,
                              ]}
                          >
                            <Text style={styles.subBody}>{building}</Text>
                            <Text style={styles.subLabel}>{isActive ? "On" : "Off"}</Text>
                          </View>
                        </TouchableOpacity>
                    );
                  })}
                </ScrollView>


                {/*<Calendar*/}
                {/*    markingType="multi-dot"*/}
                {/*    markedDates={markedDates}*/}
                {/*    onDayPress={(day) => setSelectedDate(day.dateString)}*/}
                {/*/>*/}
                <Calendar
                    markingType="multi-dot"
                    markedDates={markedDates}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    theme={{
                      backgroundColor: "#FFFFFF",
                      calendarBackground: "#FFFFFF",
                      textSectionTitleColor: "#5A6B80",
                      selectedDayBackgroundColor: "#276389",
                      selectedDayTextColor: "#FFFFFF",
                      todayTextColor: "#276389",
                      dayTextColor: "#1F1F1F",
                      textDisabledColor: "#C5CED8",
                      dotColor: "#276389",
                      selectedDotColor: "#FFFFFF",
                      arrowColor: "#276389",
                      monthTextColor: "#1F1F1F",
                      indicatorColor: "#276389",
                      textDayFontFamily: "Lexend_400Regular",
                      textMonthFontFamily: "Lexend_400Regular",
                      textDayHeaderFontFamily: "Lexend_400Regular",
                      textDayFontSize: 15,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 13,
                    }}
                    style={styles.calendar}
                />
              </>
            }
            renderItem={({ item }) => {
              const tone = typeToneMap[item.type] || "green";

              return (
                  <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setSelectedEvent(item)}
                  >
                    <View
                        style={[
                          styles.notificationCard,
                          tone === "red"
                              ? styles.notificationRed
                              : styles.notificationGreen,
                        ]}
                    >
                      <View style={styles.notificationTopRow}>
                        <Text style={styles.notificationTitle}>
                          {item.title} -{" "}
                          {buildingNameMap[item.location] ?? item.location}
                        </Text>

                        <View
                            style={[
                              styles.badge,
                              tone === "red" ? styles.badgeRed : styles.badgeGreen,
                            ]}
                        >
                          <Text style={styles.badgeText}>
                            {typeLabelMap[item.type] || "Low"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.notificationMetaRow}>
                        <Text style={styles.notificationMeta}>
                          {buildingNameMap[item.location] ?? item.location}
                          {item.floor ? ` · Floor ${item.floor}` : ""}
                        </Text>

                        <Text style={styles.notificationMeta}>
                          {item.date} · {item.time}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No events for this date</Text>
                <Text style={styles.emptyStateBody}>
                  Try another date or remove some building filters.
                </Text>
              </View>
            }
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
                      {buildingNameMap[selectedEvent.location] ??
                          selectedEvent.location}
                      {selectedEvent.floor ? ` — Floor ${selectedEvent.floor}` : ""}
                    </Text>

                    <View style={styles.modalBadgeRow}>
                      <View
                          style={[
                            styles.badge,
                            typeToneMap[selectedEvent.type] === "red"
                                ? styles.badgeRed
                                : styles.badgeGreen,
                          ]}
                      >
                        <Text style={styles.badgeText}>
                          {typeLabelMap[selectedEvent.type] || "Low"}
                        </Text>
                      </View>

                      <Text style={styles.modalTime}>
                        {selectedEvent.date} · {selectedEvent.time}
                      </Text>
                    </View>

                    <Text style={styles.modalSectionTitle}>Summary</Text>
                    <Text style={styles.modalDescription}>
                      {selectedEvent.description || "No description provided."}
                    </Text>
                  </>
              )}
            </Pressable>
          </Pressable>
        </Modal>

        <ReportFormModal
            visible={isReportModalVisible}
            onClose={() => setIsReportModalVisible(false)}
            onSubmitSuccess={loadReports}
        />

        <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
      </SafeAreaView>
  );
}