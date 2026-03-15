import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StatusBar, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
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

  const [events, setEvents] = useState<Record<string, Event[]>>({
    "2026-02-25": [
      {
        id: 1,
        title: "Protest Spotted",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "1",
        date: "2026-02-25",
        time: "12:00pm",
      },
      {
        id: 2,
        title: "Elevators Out of Order",
        acc: "LB",
        location: "LB",
        floor: "2",
        type: "maintenance",
        date: "2026-02-25",
        time: "2:00pm",
      },
    ],
    "2026-02-26": [
      {
        id: 1,
        title: "Protest Seen",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "3",
        date: "2026-02-26",
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

  const selectedEvents = events[selectedDate] || [];

  if (!fontsLoaded || loadingReports) {
    return null;
  }

  console.log("Selected:", selectedDate);
  console.log("Events:", events[selectedDate]);

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollableContent}>
        {/* Header*/}
        <View style={styles.header}>
          <Text style={styles.title}>Your Events</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventLegends}
        >
          <View style={[styles.subCard, styles.red]}>
            <Text style={styles.subBody}>EV</Text>
          </View>

          <View style={[styles.subCard, styles.green]}>
            <Text style={styles.subBody}>LB</Text>
          </View>

          <View style={[styles.subCard, styles.unsubbed]}>
            <Text style={styles.subBody}>H</Text>
          </View>

          <View style={[styles.subCard, styles.unsubbed]}>
            <Text style={styles.subBody}>JM</Text>
          </View>

          <View style={[styles.subCard, styles.unsubbed]}>
            <Text style={styles.subBody}>FB</Text>
          </View>
        </ScrollView>

        <Calendar
          markingType={"multi-dot"}
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />

        {events[selectedDate] && (
          <FlatList
            style={{ marginTop: 8 }}
            data={events[selectedDate]}
            keyExtractor={(item) => `${item.id}-${item.date}`}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.notification,
                  {
                    backgroundColor: colorMap[item.location] || "#DDD",
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

                  <Text style={styles.notificationBody}>
                    <Text style={{ fontStyle: "italic", fontSize: 10 }}>
                      {item.time}
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          />
        )}

        {events[selectedDate] === undefined ||
          (events[selectedDate]?.length === 0 && (
            <Text style={styles.title}>No events for this day</Text>
          ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
