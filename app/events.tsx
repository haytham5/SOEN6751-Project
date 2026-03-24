import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import { Building2, Clock } from "lucide-react-native";
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
import Icon from "react-native-vector-icons/MaterialIcons";
import AdminEventModal from "./components/AdminEventModal";
import BottomNav from "./components/bottomNav";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import { getReports, Report } from "./data/reportSH";
import { useTheme } from "./data/themeProvider";
import { styles as importStyles } from "./styles/eventsStyles";
import { getCurrentUser } from "./utils/authStorage";

type Event = {
  id: string;
  title: string;
  acc: string;
  type: "protest" | "event" | "accessibility" | "maintenance";
  date: string;
  floor: string;
  room?: string;
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

const typeDotColorMap: Record<string, string> = {
  protest: "#e7548b",
  event: "#56bab8",
  accessibility: "#56bab8",
  maintenance: "#9796b8",
};

const buildingColorMap: Record<string, string> = {
  EV: "#FF9898",
  H: "#4CAF50",
  FB: "#a683eb",
  JMSB: "#2196F3",
  JM: "#2196F3",
  LB: "#FFC107",
};

const formatEventType = (type: Event["type"]) => {
  switch (type) {
    case "event":
      return "Event";
    case "protest":
      return "Protest";
    case "accessibility":
      return "Accessibility";
    case "maintenance":
      return "Maintenance";
    default:
      return type;
  }
};

export default function Events() {
  const { theme } = useTheme();
  const scheme = theme;
  const styles = importStyles(scheme);

  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoading] = useState(true);

  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const [canAddEvents, setCanAddEvents] = useState(false);
  const [showAdminEventModal, setShowAdminEventModal] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setCanAddEvents(user?.role === "admin");
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
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

  const openAdminEventModal = () => {
    setShowAdminEventModal(true);
  };

  const reportEventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};

    reports
      .filter((report) => report.isScheduledEvent === true)
      .forEach((report) => {
        if (!grouped[report.date]) {
          grouped[report.date] = [];
        }

        grouped[report.date].push({
          id: `report-${report.id}`,
          title: report.name || report.type,
          acc: report.building,
          type: report.type as Event["type"],
          date: report.date,
          floor: report.floor,
          room: (report as any).room,
          location: report.building,
          time: report.time,
          description: report.description || "No description provided.",
        });
      });

    return grouped;
  }, [reports]);

  const filteredEventsByDate = useMemo(() => {
    const filtered: Record<string, Event[]> = {};

    Object.entries(reportEventsByDate).forEach(([date, events]) => {
      const matchingEvents = events.filter((event) =>
        selectedBuildings.includes(event.location),
      );

      if (matchingEvents.length > 0) {
        filtered[date] = matchingEvents;
      }
    });

    return filtered;
  }, [reportEventsByDate, selectedBuildings]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    Object.keys(filteredEventsByDate).forEach((date) => {
      marks[date] = {
        marked: true,
        dots: filteredEventsByDate[date].map((event) => ({
          key: event.id,
          color: typeDotColorMap[event.type] || "#56bab8",
        })),
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] ?? {}),
      selected: true,
      selectedColor: "#56bab8",
    };

    return marks;
  }, [filteredEventsByDate, selectedDate]);

  const selectedEvents = filteredEventsByDate[selectedDate] || [];

  const buildingFilters = ["EV", "LB", "H", "JM", "FB"];

  if (!fontsLoaded || loadingReports) {
    return null;
  }

  return (
    <SafeAreaView style={styles.background}>
      <OfflineBanner />
      <StatusBar backgroundColor={scheme.white} barStyle="dark-content" />

      <FlatList
        data={selectedEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollableContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Your Events</Text>
              {canAddEvents && (
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={openAdminEventModal}
                >
                  <Text style={styles.adminButtonText}>+ Add Event</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionDescription}>
              Tap a building to filter events.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subscriptions}
            >
              {buildingFilters.map((building) => {
                const isActive = selectedBuildings.includes(building);
                const color = buildingColorMap[building] ?? "#9c9c9c";

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
                        {
                          backgroundColor: isActive ? color : "transparent",
                          borderWidth: 2,
                          borderColor: color,
                        },
                        isActive
                          ? styles.subCardActive
                          : styles.subCardInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.subCard,
                          isActive ? styles.green : styles.unsubbed,
                          isActive
                            ? styles.subCardActive
                            : styles.subCardInactive,
                        ]}
                      >
                        <Text style={styles.subBody}>{building}</Text>
                        <Text style={styles.subLabel}>
                          {isActive ? "On" : "Off"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.calendarCard}>
              <Calendar
                markingType="multi-dot"
                markedDates={markedDates}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                theme={{
                  backgroundColor: scheme.white,
                  calendarBackground: scheme.white,
                  textSectionTitleColor: scheme.muted,
                  selectedDayBackgroundColor: scheme.primary,
                  selectedDayTextColor: scheme.white,
                  todayTextColor: scheme.pink,
                  dayTextColor: scheme.text,
                  textDisabledColor: "#C5CED8",
                  dotColor: scheme.primary,
                  selectedDotColor: scheme.white,
                  arrowColor: scheme.primaryDark,
                  monthTextColor: scheme.text,
                  indicatorColor: scheme.primary,
                  textDayFontFamily: "Lexend_400Regular",
                  textMonthFontFamily: "Lexend_400Regular",
                  textDayHeaderFontFamily: "Lexend_400Regular",
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 13,
                }}
                style={styles.calendar}
              />
            </View>
          </>
        }
        renderItem={({ item }) => {
          const typeLabel = formatEventType(item.type);

          return (
            <View
              style={[
                styles.notificationCard,
                {
                  borderLeftColor:
                    buildingColorMap[item.location] ?? scheme.border,
                },
              ]}
            >
              <View style={styles.updateCardInner}>
                <View style={styles.updateCardLeft}>
                  <Text style={styles.updateEventTitle}>{item.title}</Text>

                  <View style={styles.updateTypeRow}>
                    <Icon
                      name={item.type === "event" ? "event" : "campaign"}
                      size={16}
                      color={scheme.primaryDark}
                    />
                    <Text style={styles.updateTypeLabel}>{typeLabel}</Text>
                  </View>

                  <View style={styles.updateMetaRow}>
                    <Clock size={13} color="#5A6B80" />
                    <Text style={styles.updateMeta}>{item.time}</Text>
                  </View>

                  <View style={styles.updateMetaRow}>
                    <Building2 size={13} color="#5A6B80" />
                    <Text style={styles.updateMeta}>
                      {buildingNameMap[item.location] ?? item.location}
                      {item.floor ? ` · Floor ${item.floor}` : ""}
                      {item.room ? ` · Room ${item.room}` : ""}
                    </Text>
                  </View>

                  {!!item.description && (
                    <Text style={styles.eventPreviewText} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.chevronButton}
                onPress={() => setSelectedEvent(item)}
              >
                <Icon name="expand-more" size={24} color={scheme.primaryDark} />
              </TouchableOpacity>
            </View>
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

                <View style={styles.updateMetaRow}>
                  <Building2 size={18} color="#444" />
                  <Text style={styles.modalBuilding}>
                    {buildingNameMap[selectedEvent.location] ??
                      selectedEvent.location}
                    {selectedEvent.floor
                      ? ` — Floor ${selectedEvent.floor}`
                      : ""}
                    {selectedEvent.room ? ` — Room ${selectedEvent.room}` : ""}
                  </Text>
                </View>

                <View style={styles.updateMetaRow}>
                  <Icon name="event" size={16} color="#888" />
                  <Text style={styles.modalTime}>{selectedEvent.date}</Text>
                </View>

                <View style={styles.updateMetaRow}>
                  <Clock size={16} color="#888" />
                  <Text style={styles.modalTime}>{selectedEvent.time}</Text>
                </View>

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

      <AdminEventModal
        visible={showAdminEventModal}
        onClose={() => setShowAdminEventModal(false)}
        onSubmitSuccess={loadReports}
      />

      <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
    </SafeAreaView>
  );
}
