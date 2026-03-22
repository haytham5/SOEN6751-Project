import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import { CheckCircle, ThumbsUp, TriangleAlert } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { initialSubscriptions } from "./data/notificationData";
import {
  getReports,
  markReportResolved,
  Report,
  upvoteReport,
} from "./data/reportSH";
import { getCurrentUser } from "./utils/authStorage";

import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNav from "./components/bottomNav";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import { styles } from "./styles/notificationsStyles";

const buildingColorMap: Record<string, string> = {
  EV: "#56bab8",
  H: "#5a8c8b",
  JMSB: "#e7548b",
  LB: "#9796b8",
  FB: "#d6b1c3",
};

const today = new Date().toISOString().split("T")[0];

export default function Notifications() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const [sortMode, setSortMode] = useState<"time" | "building">("time");
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user && !user.isGuest) {
        setCurrentUserId(user.email);
        setCurrentUserRole(user.role);
        setIsGuest(false);
      } else {
        setIsGuest(true);
        setCurrentUserId(null);
        setCurrentUserRole(null);
      }
    });
  }, []);

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

  const handleUpvote = async (reportId: string) => {
    if (!currentUserId || isGuest) return;
    await upvoteReport(reportId, currentUserId);
    await loadReports();
  };

  const handleResolve = async (reportId: string) => {
    if (!currentUserId || isGuest) return;
    await markReportResolved(reportId, currentUserRole ?? "concordian");
    await loadReports();
  };

  const activeBuildingIds = subscriptions
      .filter((sub) => sub.isSubscribed)
      .map((sub) => sub.id);

  let visibleReports = reports.filter(
      (r) => !r.isScheduledEvent && r.date === today
  );

  if (activeBuildingIds.length > 0) {
    visibleReports = visibleReports.filter((report) =>
        activeBuildingIds.includes(report.building)
    );
  }

  visibleReports = [...visibleReports].sort((a, b) => {
    if (sortMode === "building") {
      return a.building.localeCompare(b.building);
    }

    const toMins = (t: string) => {
      const match = t.match(/(\d{1,2}):(\d{2})\s?(AM|PM|am|pm)?/);
      if (!match) return 0;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const mer = match[3]?.toLowerCase();
      if (mer === "pm" && h !== 12) h += 12;
      if (mer === "am" && h === 12) h = 0;
      return h * 60 + m;
    };

    return toMins(b.time) - toMins(a.time);
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
                    {/*<View*/}
                    {/*    style={[*/}
                    {/*      styles.subCard,*/}
                    {/*      isActive*/}
                    {/*          ? sub.tone === "red"*/}
                    {/*              ? styles.red*/}
                    {/*              : styles.green*/}
                    {/*          : styles.unsubbed,*/}
                    {/*      isActive ? styles.subCardActive : styles.subCardInactive,*/}
                    {/*    ]}*/}
                    {/*>*/}
                    <View
                        style={[
                          styles.subCard,
                          isActive ? styles.green : styles.unsubbed,
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
            <Text>Today&apos;s Reports</Text>
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

          {visibleReports.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No reports today</Text>
                <Text style={styles.emptyStateBody}>
                  No reports have been submitted today.
                </Text>
              </View>
          ) : (
              visibleReports.map((report) => {
                const hasUpvoted = currentUserId
                    ? report.upvotedBy?.includes(currentUserId)
                    : false;
                const isResolved = report.isResolved;
                const isDisabled = isGuest || !currentUserId;

                const typeIcon =
                    report.type === "accessibility" ? "accessible" : "campaign";

                const typeLabel = report.accessibilitySubtype
                    ? report.accessibilitySubtype.replace("_", " ")
                    : report.type;

                const submitterLabel =
                    report.submittedBy === "security" ? "security" : "a concordian";

                return (
                    <View
                        key={report.id}
                        style={[
                          styles.notificationCard,
                          {
                            borderLeftColor:
                                buildingColorMap[report.building] ?? "#E7E7EC",
                          },
                        ]}
                    >
                      <View style={styles.updateCardInner}>
                        <View style={styles.updateCardLeft}>
                          <Text style={styles.updateEventTitle}>
                            {report.name || report.type}
                          </Text>

                          {report.isSevere && (
                              <View style={styles.severeIndicator}>
                                <TriangleAlert size={13} color="#D98B1F" />
                                <Text style={styles.severeIndicatorText}>
                                  Marked Severe by Security
                                </Text>
                              </View>
                          )}

                          {report.isResolved && report.timeline && (
                              <Text style={styles.resolvedMeta}>
                                Resolved at{" "}
                                {report.timeline.find((e) => e.action === "resolved")
                                    ?.time ?? "unknown"}
                              </Text>
                          )}

                          <Text style={styles.updateMeta}>{report.time}</Text>

                          <View style={styles.updateTypeRow}>
                            <Icon name={typeIcon} size={16} color="#5a8c8b" />
                            <Text style={styles.updateTypeLabel}>{typeLabel}</Text>
                          </View>

                          <View style={styles.updateReporterRow}>
                            <Text style={styles.updateMeta}>
                              Reported by {submitterLabel}
                            </Text>

                            {report.isVerifiedBySecurity && (
                                <View style={styles.verifiedBadge}>
                                  <Icon name="check-circle" size={13} color="#2E9B63" />
                                  <Text style={styles.verifiedText}>Verified</Text>
                                </View>
                            )}
                          </View>
                        </View>

                        <View style={styles.updateCardActions}>
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              isDisabled && styles.actionButtonDisabled,      // disabled if guest
                              hasUpvoted && styles.actionButtonUpvoted,       // highlighted if upvoted
                            ]}
                            onPress={() => handleUpvote(report.id)}
                            disabled={isDisabled}  // ← only disabled for guests, not for having upvoted
                          >
                            <ThumbsUp
                              size={18}
                              color={isDisabled ? "#aaa" : hasUpvoted ? "#276389" : "#276389"}
                            />
                            <Text style={[
                              styles.actionCount,
                              isDisabled && styles.actionCountDisabled,
                            ]}>
                              {report.upvotedBy?.length ?? 0}
                            </Text>
                          </TouchableOpacity>

                            {/* Resolved button */}
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              isDisabled && styles.actionButtonDisabled,
                              (report.resolvedBy ?? []).includes(currentUserRole ?? "") && styles.actionButtonUpvoted,
                            ]}
                            onPress={() => handleResolve(report.id)}
                            disabled={isDisabled}
                          >
                            <CheckCircle
                              size={18}
                              color={isDisabled ? "#aaa" : "#276389"}
                            />
                            <Text style={[
                              styles.actionCount,
                              isDisabled && styles.actionCountDisabled,
                            ]}>
                              {report.resolvedBy?.length ?? 0}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                            {/* See more button */}
                      <TouchableOpacity
                          style={styles.chevronButton}
                          onPress={() => setSelectedReport(report)}
                      >
                        <Icon name="expand-more" size={24} color="#5a8c8b" />
                      </TouchableOpacity>
                    </View>
                );
              })
          )}
        </ScrollView>

        <Modal
            visible={selectedReport !== null}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedReport(null)}
        >
          <Pressable
              style={styles.modalOverlay}
              onPress={() => setSelectedReport(null)}
          >
            <Pressable
                style={styles.modalCard}
                onPress={(e) => e.stopPropagation()}
            >
              {selectedReport && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        {selectedReport.name || selectedReport.type}
                      </Text>
                      <TouchableOpacity onPress={() => setSelectedReport(null)}>
                        <Icon name="close" size={24} color="#5a8c8b" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.modalBuilding}>
                      {selectedReport.building} · Floor {selectedReport.floor}
                    </Text>

                    {selectedReport.isSevere && (
                        <View style={styles.severeIndicator}>
                          <TriangleAlert size={13} color="#D98B1F" />
                          <Text style={styles.severeIndicatorText}>
                            Marked Severe by Security
                          </Text>
                        </View>
                    )}

                    {selectedReport.description ? (
                        <>
                          <Text style={styles.modalSectionTitle}>Description</Text>
                          <Text style={styles.modalDescription}>
                            {selectedReport.description}
                          </Text>
                        </>
                    ) : null}

                    {selectedReport.image ? (
                        <>
                          <Text style={styles.modalSectionTitle}>Photo</Text>
                          <Image
                              source={{ uri: selectedReport.image }}
                              style={styles.modalImage}
                              resizeMode="cover"
                          />
                        </>
                    ) : null}

                    <Text style={styles.modalSectionTitle}></Text>
                    {(selectedReport.timeline ?? []).map((event, index) => (
                        <View key={index} style={styles.timelineRow}>
                          <View style={styles.timelineDot} />
                          <Text style={styles.timelineText}>
                            {event.action === "reported" &&
                                `First reported by ${event.by}`}
                            {event.action === "upvoted" &&
                                `Confirmed by a concordian`}
                            {event.action === "verified" &&
                                `Verified by security`}
                            {event.action === "resolved" &&
                                `Marked resolved by ${
                                    event.by === "security"
                                        ? "security"
                                        : "a concordian"
                                }`}
                            {event.action === "severe" &&
                                `Marked severe by security`}
                            <Text style={styles.timelineTime}> · {event.time}</Text>
                          </Text>
                        </View>
                    ))}
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