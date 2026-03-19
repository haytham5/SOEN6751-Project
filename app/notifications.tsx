import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getReports, Report } from "./data/reportSH";

import {
  initialSubscriptions,
  NotificationItem,
  testReports,
} from "./data/notificationData";

import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import { styles } from "./styles/notificationsStyles";

const buildingNameMap: Record<string, string> = {
  EV: "Engineering and Visual Arts",
  H: "Hall Building",
  JMSB: "JMSB",
  LB: "Main Library",
  FB: "Faubourg Building",
};

const toMinutesSinceMidnight = (time: string): number => {
  const match = time.match(/(\d{1,2}):(\d{2})\s?(AM|PM|am|pm)?/);

  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hours !== 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const reportToNotification = (report: Report): NotificationItem => {
  const isAccessibility = report.type === "accessibility";

  return {
    id: `report-${report.id}`,
    buildingId: report.building,
    buildingName: buildingNameMap[report.building] ?? report.building,
    eventName: report.name || report.type,
    description: report.description || "No description provided.",
    timeLabel: report.time,
    timeAgo: `${report.date} · ${report.time}`,
    minutesSinceMidnight: toMinutesSinceMidnight(report.time),
    tone: isAccessibility ? "green" : "red",
  };
};

export default function Notifications() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const [sortMode, setSortMode] = useState<"time" | "building">("time");
  const [selectedNotification, setSelectedNotification] =
      useState<NotificationItem | null>(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [reportNotifications, setReportNotifications] = useState<
      NotificationItem[]
  >([]);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const raw = await AsyncStorage.getItem("subscriptions");

        if (raw) {
          setSubscriptions(JSON.parse(raw));
        } else {
          await AsyncStorage.setItem(
              "subscriptions",
              JSON.stringify(initialSubscriptions)
          );
        }
      } catch (e) {
        console.log("Error loading subscriptions:", e);
      }
    };

    loadSubscriptions();
  }, []);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const loadReports = useCallback(async () => {
    try {
      const reports = await getReports();
      const combined = [...testReports, ...reports]
        .filter((r) => !r.isScheduledEvent);  // exclude scheduled events
      const mapped = combined.map(reportToNotification);
      setReportNotifications(mapped);
    } catch (error) {
      console.log("error loading report notifications", error);
    }
  }, []);

  useFocusEffect(
      useCallback(() => {
        loadReports();
      }, [loadReports])
  );

  const handleToggleSubscription = (id: string) => {
    setSubscriptions((current) => {
      const updated = current.map((sub) =>
          sub.id === id ? { ...sub, isSubscribed: !sub.isSubscribed } : sub
      );

      AsyncStorage.setItem("subscriptions", JSON.stringify(updated));
      return updated;
    });
  };

  const activeBuildingIds = subscriptions
      .filter((sub) => sub.isSubscribed)
      .map((sub) => sub.id);

  const allNotifications = useMemo(
      () => [...reportNotifications],
      [reportNotifications]
  );

  let visibleNotifications = allNotifications.filter((notification) =>
      activeBuildingIds.includes(notification.buildingId)
  );

  visibleNotifications = [...visibleNotifications].sort((a, b) => {
    if (sortMode === "time") {
      return b.minutesSinceMidnight - a.minutesSinceMidnight;
    }

    return a.buildingId.localeCompare(b.buildingId);
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <SafeAreaView style={styles.background}>
        <OfflineBanner />
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

        <ScrollView contentContainerStyle={styles.scrollableContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Subscriptions</Text>
          </View>

          <Text style={styles.sectionDescription}>
            Tap a building to turn notifications on or off.
          </Text>

          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subscriptions}
          >
            {subscriptions.map((sub) => {
              const isActive = sub.isSubscribed;

              return (
                  <TouchableOpacity
                      key={sub.id}
                      activeOpacity={0.9}
                      onPress={() => handleToggleSubscription(sub.id)}
                  >
                    <View
                        style={[
                          styles.subCard,
                          isActive
                              ? sub.tone === "red"
                                  ? styles.red
                                  : styles.green
                              : styles.unsubbed,
                          isActive ? styles.subCardActive : styles.subCardInactive,
                        ]}
                    >
                      <Text style={styles.subBody}>{sub.label}</Text>
                      <Text style={styles.subLabel}>{isActive ? "On" : "Off"}</Text>
                    </View>
                  </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.header}>
            <Text style={styles.title}>Your Notifications</Text>

            <View style={styles.toggleGroup}>
              <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    sortMode === "time" && styles.toggleOptionActive,
                  ]}
                  onPress={() => setSortMode("time")}
              >
                <Text
                    style={[
                      styles.toggleLabel,
                      sortMode === "time" && styles.toggleLabelActive,
                    ]}
                >
                  Time
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    sortMode === "building" && styles.toggleOptionActive,
                  ]}
                  onPress={() => setSortMode("building")}
              >
                <Text
                    style={[
                      styles.toggleLabel,
                      sortMode === "building" && styles.toggleLabelActive,
                    ]}
                >
                  Building
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {visibleNotifications.map((notification) => (
              <TouchableOpacity
                  key={notification.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedNotification(notification)}
              >
                <View
                    style={[
                      styles.notificationCard,
                      notification.tone === "red"
                          ? styles.notificationRed
                          : styles.notificationGreen,
                    ]}
                >
                  <View style={styles.notificationTopRow}>
                    <Text style={styles.notificationTitle}>
                      {notification.eventName} - {notification.buildingName}
                    </Text>

                    <View
                        style={[
                          styles.badge,
                          notification.tone === "red"
                              ? styles.badgeRed
                              : styles.badgeGreen,
                        ]}
                    >
                      <Text style={styles.badgeText}>
                        {notification.tone === "red" ? "High" : "Low"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.notificationMetaRow}>
                    <Text style={styles.notificationMeta}>
                      {notification.buildingName}
                    </Text>
                    <Text style={styles.notificationMeta}>
                      {notification.timeAgo}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
          ))}

          {visibleNotifications.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No notifications yet</Text>
                <Text style={styles.emptyStateBody}>
                  Turn on at least one building above to see updates here.
                </Text>
              </View>
          )}
        </ScrollView>

        <Modal
            visible={selectedNotification !== null}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedNotification(null)}
        >
          <Pressable
              style={styles.modalOverlay}
              onPress={() => setSelectedNotification(null)}
          >
            <Pressable
                style={styles.modalCard}
                onPress={(e) => e.stopPropagation()}
            >
              {selectedNotification && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        {selectedNotification.eventName}
                      </Text>

                      <TouchableOpacity
                          onPress={() => setSelectedNotification(null)}
                          style={styles.closeButton}
                      >
                        <Text style={styles.closeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.modalBuilding}>
                      {selectedNotification.buildingName}
                    </Text>

                    <View style={styles.modalBadgeRow}>
                      <View
                          style={[
                            styles.badge,
                            selectedNotification.tone === "red"
                                ? styles.badgeRed
                                : styles.badgeGreen,
                          ]}
                      >
                        <Text style={styles.badgeText}>
                          {selectedNotification.tone === "red" ? "High" : "Low"}
                        </Text>
                      </View>

                      <Text style={styles.modalTime}>
                        {selectedNotification.timeAgo}
                      </Text>
                    </View>

                    <Text style={styles.modalSectionTitle}>Summary</Text>
                    <Text style={styles.modalDescription}>
                      {selectedNotification.description}
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