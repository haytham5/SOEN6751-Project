import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StatusBar, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
import { styles } from "./styles/eventsStyles";

interface RowProps {
  acc: string;
  date: string;
}

export default function Events() {
  const [selectedDate, setSelectedDate] = useState("");

  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);
  NavigationBar.setBehaviorAsync("overlay-swipe");

  type Event = {
    id: number;
    title: string;
    acc: string;
    type: string;
    date: string;
    floor: string;
    location: string;
  };

  const events: Record<string, Event[]> = {
    "2026-02-25": [
      {
        id: 1,
        title: "11:15AM - Protest Spotted",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "1",
        date: "2026-02-25",
      },
      {
        id: 2,
        title: "Elevators Out of Order",
        acc: "LB",
        location: "LB",
        floor: "2",
        type: "maintenance",
        date: "2026-02-25",
      },
    ],
    "2026-02-26": [
      {
        id: 1,
        title: "11:15PM - Protest Seen",
        acc: "EV",
        type: "protest",
        location: "EV",
        floor: "1",
        date: "2026-02-26",
      },
    ],
  };

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

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: "#276389",
    };
  }

  const selectedEvents = events[selectedDate] || [];

  if (!fontsLoaded) {
    return <AppLoading />;
  }

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

        <FlatList
          style={{ marginTop: 8 }}
          data={selectedEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // <View
            //   style={[
            //     styles.eventCard,
            //     { backgroundColor: colorMap[item.type] },
            //   ]}
            // >
            //   <Text style={styles.eventText}>{item.title}</Text>
            // </View>

            <View
              style={[
                styles.notification,
                { backgroundColor: colorMap[item.location] },
              ]}
            >
              <Text style={styles.notificationBody}>
                <Text style={styles.bold}>
                  {item.location}
                  {item.floor}
                </Text>{" "}
                {item.title}
              </Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
