import { Lexend_400Regular, useFonts } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import { CheckCircle, ThumbsUp, TriangleAlert } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewShot, { captureRef } from "react-native-view-shot";

import AuthRequiredModal from "./components/authRequiredModel";
import BottomNav from "./components/bottomNav";
import MapInfo from "./components/mapInfo";
import NearBuildingBanner from "./components/NearBuildingBanner";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import {
  getReports,
  markReportResolved,
  markReportSevere,
  Report,
  upvoteReport,
  verifyReport,
} from "./data/reportSH";
import { styles as importStyles } from "./styles/indexStyles";
import { Themes } from "./styles/Themes";
import { getCurrentUser } from "./utils/authStorage";
import { simulateNearBuilding } from "./utils/simulateGeofence";

const buildingColorMap: Record<string, string> = {
  EV: "#FF9898",
  H: "#4CAF50",
  FB: "#9C6ADE",
  LB: "#FFC107",
  JMSB: "#2196F3",
};

const today = new Date().toISOString().split("T")[0];

type ReportViewMode = "all" | "preferences";

function normalizeBuildingId(buildingId?: string): string {
  const value = buildingId?.toLowerCase().trim();

  switch (value) {
    case "ev":
      return "EV";

    case "hall":
    case "hall building":
    case "h":
      return "H";

    case "faubourg":
    case "faubourg building":
    case "fb":
      return "FB";

    case "library":
    case "webster":
    case "webster library":
    case "lb":
      return "LB";

    case "jmsb":
    case "jm":
    case "jmsb/jm":
    case "jmsb / jm":
      return "JMSB";

    default:
      return buildingId ?? "";
  }
}

const buildings: Record<string, { latitude: number; longitude: number }> = {
  EV: { latitude: 45.49548608640669, longitude: -73.57806007167528 },
  H: { latitude: 45.49721390474658, longitude: -73.57906858227709 },
  FB: { latitude: 45.4946, longitude: -73.5767 },
  LB: { latitude: 45.49677584482701, longitude: -73.57789645692377 },
  JMSB: { latitude: 45.49515518152054, longitude: -73.57885668774541 },
};

function extractPreferredBuildings(user: any): string[] {
  if (!user) return [];

  if (Array.isArray(user.buildingPreferences)) {
    return user.buildingPreferences
      .filter((b: any) => b?.subscribed === true)
      .map((b: any) => normalizeBuildingId(b?.buildingId))
      .filter(Boolean);
  }

  if (Array.isArray(user.preferredBuildings)) {
    return user.preferredBuildings
      .filter(Boolean)
      .map((b: string) => normalizeBuildingId(b));
  }

  if (Array.isArray(user.preferences?.buildings)) {
    return user.preferences.buildings
      .filter(Boolean)
      .map((b: string) => normalizeBuildingId(b));
  }

  if (Array.isArray(user.subscriptions)) {
    return user.subscriptions
      .filter((b: any) => b?.isSubscribed === true)
      .map((b: any) => normalizeBuildingId(b?.id))
      .filter(Boolean);
  }

  return [];
}

export default function Home() {
  const scheme = useColorScheme() === "dark" ? Themes.dark : Themes.light;
  const styles = importStyles(scheme);

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  const [preferredBuildings, setPreferredBuildings] = useState<string[]>([]);
  const [reportViewMode, setReportViewMode] =
    useState<ReportViewMode>("preferences");

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [buildingReports, setBuildingReports] = useState<Report[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoading] = useState(true);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    access: false,
    disruptions: false,
    resolved: false,
  });

  const previewMapRef = useRef<MapView | null>(null);
  const expandedMapRef = useRef<MapView | null>(null);

  const bubbleRefs: Record<string, React.RefObject<ViewShot | null>> = {
    EV: useRef<ViewShot | null>(null),
    H: useRef<ViewShot | null>(null),
    FB: useRef<ViewShot | null>(null),
    LB: useRef<ViewShot | null>(null),
    JMSB: useRef<ViewShot | null>(null),
  };

  const [markerImages, setMarkerImages] = useState<Record<string, string>>({});

  const loadCurrentUserState = useCallback(async () => {
    const user = await getCurrentUser();

    if (user && !user.isGuest) {
      setCurrentUserId(user.email ?? null);
      setCurrentUserRole(user.role ?? null);
      setIsGuest(false);

      const savedBuildings = extractPreferredBuildings(user);
      setPreferredBuildings(savedBuildings);

      setReportViewMode((prev) => (prev === "all" ? "all" : "preferences"));
    } else {
      setIsGuest(true);
      setCurrentUserId(null);
      setCurrentUserRole(null);
      setPreferredBuildings([]);
      setReportViewMode("all");
    }
  }, []);

  useEffect(() => {
    loadCurrentUserState();
  }, [loadCurrentUserState]);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(scheme.surface);
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const activeBuildingIds = preferredBuildings;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const loadReports = useCallback(async () => {
    try {
      let seeded = false;
      let attempts = 0;

      while (!seeded && attempts < 20) {
        const flag = await AsyncStorage.getItem("seeded");
        if (flag === "true") {
          seeded = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
      }

      const data = await getReports();
      setReports(data);

      if (selectedBuilding) {
        const filtered = data.filter(
          (r) => normalizeBuildingId(r.building) === selectedBuilding,
        );
        setBuildingReports(filtered);
      }
    } catch (e) {
      console.log("report load error", e);
    } finally {
      setLoading(false);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useFocusEffect(
    useCallback(() => {
      loadCurrentUserState();
      loadReports();
    }, [loadCurrentUserState, loadReports]),
  );

  const handleMarkerPress = async (buildingId: string) => {
    const allReports = await getReports();
    const filtered = allReports.filter(
      (r) => normalizeBuildingId(r.building) === buildingId,
    );
    setBuildingReports(filtered);
    setSelectedBuilding(buildingId);
  };

  const handleReportSubmitSuccess = async () => {
    await loadReports();
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

  const handleVerify = async (reportId: string) => {
    if (currentUserRole !== "security") return;
    await verifyReport(reportId);
    await loadReports();
  };

  const handleMarkSevere = async (reportId: string) => {
    if (currentUserRole !== "security") return;
    await markReportSevere(reportId);
    await loadReports();
  };

  const handleOpenReportFlow = async () => {
    const currentUser = await getCurrentUser();
    const isLoggedIn = currentUser && !currentUser.isGuest;

    if (!isLoggedIn) {
      setShowAuthRequiredModal(true);
      return;
    }

    setIsReportModalVisible(true);
  };

  const handleOpenReportFlowFromExpandedMap = async () => {
    const currentUser = await getCurrentUser();
    const isLoggedIn = currentUser && !currentUser.isGuest;

    if (!isLoggedIn) {
      setIsMapExpanded(false);
      setTimeout(() => setShowAuthRequiredModal(true), 150);
      return;
    }

    setIsMapExpanded(false);
    setTimeout(() => setIsReportModalVisible(true), 150);
  };

  const onMapReady = (mapInstance: MapView | null) => {
    if (!mapInstance) return;

    if (Platform.OS === "android") {
      mapInstance.setMapBoundaries(
        { latitude: 45.5000284224813, longitude: -73.5759524037535 },
        { latitude: 45.49070461581633, longitude: -73.58196697011486 },
      );
    }
  };

  const allTodayReports = useMemo(() => {
    return reports.filter((r) => !r.isScheduledEvent && r.date === today);
  }, [reports]);

  const filteredTodayReports = useMemo(() => {
    if (reportViewMode === "preferences" && activeBuildingIds.length > 0) {
      return allTodayReports.filter((r) =>
        activeBuildingIds.includes(normalizeBuildingId(r.building)),
      );
    }

    if (reportViewMode === "preferences" && activeBuildingIds.length === 0) {
      return [];
    }

    return allTodayReports;
  }, [allTodayReports, reportViewMode, activeBuildingIds]);

  const buildingCounts: Record<
    string,
    { protests: number; accessibility: number }
  > = {};

  allTodayReports.forEach((r) => {
    const buildingId = normalizeBuildingId(r.building);

    if (!buildingCounts[buildingId]) {
      buildingCounts[buildingId] = {
        protests: 0,
        accessibility: 0,
      };
    }

    if (r.type === "accessibility") {
      buildingCounts[buildingId].accessibility++;
    } else {
      buildingCounts[buildingId].protests++;
    }
  });

  useEffect(() => {
    const createMarkers = async () => {
      const images: Record<string, string> = {};

      for (const key of Object.keys(buildings)) {
        const ref = bubbleRefs[key];

        if (ref?.current) {
          const uri = await captureRef(ref, {
            format: "png",
            quality: 1,
          });
          images[key] = uri;
        }
      }

      setMarkerImages(images);
    };

    const timeout = setTimeout(createMarkers, 150);
    return () => clearTimeout(timeout);
  }, [reports]);

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  if (!fontsLoaded || loadingReports) {
    return null;
  }

  const mapRegion = {
    latitude: 45.4973,
    longitude: -73.579,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const renderMap = (mapRef: { current: MapView | null }) => {
    return (
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        showsUserLocation
        showsMyLocationButton
        moveOnMarkerPress={false}
        showsBuildings={false}
        minZoomLevel={16}
        maxZoomLevel={18}
        ref={mapRef}
        onMapReady={() => onMapReady(mapRef.current)}
      >
        {Object.keys(buildings).map((b) => {
          const coord = buildings[b];

          if (!markerImages[b]) return null;

          return (
            <Marker
              key={b}
              coordinate={coord}
              image={{ uri: markerImages[b] }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => handleMarkerPress(b)}
            />
          );
        })}
      </MapView>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <OfflineBanner />
      <NearBuildingBanner onBannerPress={handleMarkerPress} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ position: "absolute", top: -9999, left: -9999 }}>
          {Object.keys(buildings).map((b) => (
            <ViewShot key={b} ref={bubbleRefs[b]}>
              <MapInfo
                title={b}
                protests={buildingCounts[b]?.protests || 0}
                accessibility={buildingCounts[b]?.accessibility || 0}
              />
            </ViewShot>
          ))}
        </View>

        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity
            onLongPress={() => setDemoMode((prev) => !prev)}
            style={{ flexShrink: 0 }}
          >
            <Text style={styles.title} numberOfLines={1}>
              Home
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapPreviewWrapper}>
          {renderMap(previewMapRef)}

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mapPreviewOverlay}
            onPress={() => setIsMapExpanded(true)}
          >
            <Text style={styles.mapPreviewText}>Tap to expand map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addReport}
            onPress={handleOpenReportFlow}
          >
            <Icon name="add-circle" size={24} color="#276389" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportFilters}>
            <Icon name="filter-alt" size={24} color="#276389" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.relaxMode}>
            <Icon name="bedtime" size={24} color="#276389" />
          </TouchableOpacity>
        </View>

        <Modal visible={isMapExpanded} animationType="slide">
          <View style={styles.fullScreenContainer}>
            {renderMap(expandedMapRef)}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsMapExpanded(false)}
            >
              <Icon name="close" size={28} color="#276389" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fullScreenAddReport}
              onPress={handleOpenReportFlowFromExpandedMap}
            >
              <Icon name="add-circle" size={24} color="#276389" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.fullScreenReportFilters}>
              <Icon name="filter-alt" size={24} color="#276389" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.fullScreenRelaxMode}>
              <Icon name="bedtime" size={24} color="#276389" />
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.updatesSection}>
          <View style={styles.updatesHeader}>
            <Text style={styles.updatesTitle}>Your Updates</Text>
            <Text style={styles.updatesSubtitle}>
              {reportViewMode === "preferences"
                ? "Showing reports matching your preferences"
                : "Showing all reports from today"}
            </Text>

            <View style={styles.reportModeToggle}>
              <TouchableOpacity
                style={[
                  styles.reportModeButton,
                  reportViewMode === "preferences" &&
                    styles.reportModeButtonActive,
                  isGuest && styles.reportModeButtonDisabled,
                ]}
                onPress={() => {
                  if (!isGuest) setReportViewMode("preferences");
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.reportModeButtonText,
                    reportViewMode === "preferences" &&
                      styles.reportModeButtonTextActive,
                    isGuest && styles.reportModeButtonTextDisabled,
                  ]}
                >
                  My Preferences
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reportModeButton,
                  reportViewMode === "all" && styles.reportModeButtonActive,
                ]}
                onPress={() => setReportViewMode("all")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.reportModeButtonText,
                    reportViewMode === "all" &&
                      styles.reportModeButtonTextActive,
                  ]}
                >
                  All Today
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {(() => {
            const reportsToDisplay = filteredTodayReports;

            const accessReports = reportsToDisplay.filter(
              (r) => r.type === "accessibility" && !r.isResolved,
            );
            const disruptionReports = reportsToDisplay.filter(
              (r) =>
                (r.type === "protest" || r.type === "event") && !r.isResolved,
            );
            const resolvedReports = reportsToDisplay.filter(
              (r) => r.isResolved,
            );

            const sections = [
              {
                key: "access",
                label: "Access",
                reports: accessReports,
                icon: "accessible",
                severeCount: accessReports.filter((r) => r.isSevere).length,
              },
              {
                key: "disruptions",
                label: "Disruptions",
                reports: disruptionReports,
                icon: "campaign",
                severeCount: disruptionReports.filter((r) => r.isSevere).length,
              },
              {
                key: "resolved",
                label: "Resolved",
                reports: resolvedReports,
                icon: "check-circle",
                severeCount: 0,
              },
            ];

            return sections.map(
              ({ key, label, reports: sectionReports, icon, severeCount }) => (
                <View key={key} style={styles.accordionSection}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => toggleSection(key)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.accordionHeaderLeft}>
                      <Icon name={icon} size={22} color="#276389" />
                      <Text style={styles.accordionLabel}>{label}</Text>

                      <View style={styles.accordionBadge}>
                        <Text style={styles.accordionBadgeText}>
                          {sectionReports.length}
                        </Text>
                      </View>

                      {severeCount > 0 && (
                        <View style={styles.severeBadge}>
                          <TriangleAlert size={14} color="#F59E0B" />
                          <Text style={styles.severeBadgeText}>
                            {severeCount}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Icon
                      name={openSections[key] ? "expand-less" : "expand-more"}
                      size={24}
                      color="#276389"
                    />
                  </TouchableOpacity>

                  {openSections[key] && (
                    <View style={styles.accordionContent}>
                      {sectionReports.length === 0 ? (
                        <Text style={styles.accordionEmptyText}>
                          {reportViewMode === "preferences" &&
                          key !== "resolved"
                            ? `No ${label.toLowerCase()} reports matching your preferences today.`
                            : `No ${label.toLowerCase()} reports today.`}
                        </Text>
                      ) : (
                        sectionReports.map((report) => {
                          const hasUpvoted = currentUserId
                            ? report.upvotedBy?.includes(currentUserId)
                            : false;
                          const isResolved = report.isResolved;
                          const isDisabled = isGuest || !currentUserId;

                          const typeIcon =
                            report.type === "accessibility"
                              ? "accessible"
                              : "campaign";

                          const typeLabel = report.accessibilitySubtype
                            ? report.accessibilitySubtype.replace("_", " ")
                            : report.type;

                          const submitterLabel =
                            report.submittedBy === "security"
                              ? "security"
                              : "a concordian";

                          return (
                            <View
                              key={report.id}
                              style={[
                                styles.updateCard,
                                {
                                  borderLeftColor:
                                    buildingColorMap[
                                      normalizeBuildingId(report.building)
                                    ] ?? "#DDE3EA",
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
                                      <TriangleAlert
                                        size={13}
                                        color="#F59E0B"
                                      />
                                      <Text style={styles.severeIndicatorText}>
                                        Marked Severe by Security
                                      </Text>
                                    </View>
                                  )}

                                  {report.isResolved && report.timeline && (
                                    <Text style={styles.resolvedMeta}>
                                      Resolved at{" "}
                                      {report.timeline.find(
                                        (e) => e.action === "resolved",
                                      )?.time ?? "unknown"}
                                    </Text>
                                  )}

                                  <Text style={styles.updateMeta}>
                                    {normalizeBuildingId(report.building)} ·{" "}
                                    {report.time}
                                  </Text>

                                  <View style={styles.updateTypeRow}>
                                    <Icon
                                      name={typeIcon}
                                      size={16}
                                      color="#276389"
                                    />
                                    <Text style={styles.updateTypeLabel}>
                                      {typeLabel}
                                    </Text>
                                  </View>

                                  <View style={styles.updateReporterRow}>
                                    <Text style={styles.updateMeta}>
                                      Reported by {submitterLabel}
                                    </Text>

                                    {report.isVerifiedBySecurity && (
                                      <View style={styles.verifiedBadge}>
                                        <Icon
                                          name="check-circle"
                                          size={13}
                                          color="#1FA64A"
                                        />
                                        <Text style={styles.verifiedText}>
                                          Verified
                                        </Text>
                                      </View>
                                    )}
                                  </View>

                                  {currentUserRole === "security" &&
                                    !report.isVerifiedBySecurity &&
                                    !report.isResolved && (
                                      <TouchableOpacity
                                        onPress={() => handleVerify(report.id)}
                                        style={styles.markSevereButton}
                                      >
                                        <CheckCircle
                                          size={13}
                                          color="#1FA64A"
                                        />
                                        <Text style={styles.markSevereText}>
                                          Verify
                                        </Text>
                                      </TouchableOpacity>
                                    )}

                                  {currentUserRole === "security" &&
                                    !report.isSevere && (
                                      <TouchableOpacity
                                        onPress={() =>
                                          handleMarkSevere(report.id)
                                        }
                                        style={styles.markSevereButton}
                                      >
                                        <TriangleAlert
                                          size={13}
                                          color="#F59E0B"
                                        />
                                        <Text style={styles.markSevereText}>
                                          Mark Severe
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                </View>

                                <View style={styles.updateCardActions}>
                                  <TouchableOpacity
                                    style={[
                                      styles.actionButton,
                                      (hasUpvoted || isDisabled) &&
                                        styles.actionButtonDisabled,
                                    ]}
                                    onPress={() => handleUpvote(report.id)}
                                    disabled={hasUpvoted || isDisabled}
                                  >
                                    <ThumbsUp
                                      size={18}
                                      color={
                                        hasUpvoted || isDisabled
                                          ? "#aaa"
                                          : "#276389"
                                      }
                                    />
                                    <Text
                                      style={[
                                        styles.actionCount,
                                        (hasUpvoted || isDisabled) &&
                                          styles.actionCountDisabled,
                                      ]}
                                    >
                                      {report.upvotedBy?.length ?? 0}
                                    </Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    style={[
                                      styles.actionButton,
                                      (isResolved || isDisabled) &&
                                        styles.actionButtonDisabled,
                                    ]}
                                    onPress={() => handleResolve(report.id)}
                                    disabled={isResolved || isDisabled}
                                  >
                                    <CheckCircle
                                      size={18}
                                      color={
                                        isResolved || isDisabled
                                          ? "#aaa"
                                          : "#276389"
                                      }
                                    />
                                    <Text
                                      style={[
                                        styles.actionCount,
                                        (isResolved || isDisabled) &&
                                          styles.actionCountDisabled,
                                      ]}
                                    >
                                      {isResolved ? "✓" : "0"}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>

                              <TouchableOpacity
                                style={styles.chevronButton}
                                onPress={() => setSelectedReport(report)}
                              >
                                <Icon
                                  name="expand-more"
                                  size={24}
                                  color="#276389"
                                />
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>
              ),
            );
          })()}
        </View>
      </ScrollView>

      <Modal
        visible={selectedBuilding !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBuilding(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedBuilding(null)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedBuilding && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedBuilding}</Text>
                  <TouchableOpacity onPress={() => setSelectedBuilding(null)}>
                    <Icon name="close" size={24} color="#276389" />
                  </TouchableOpacity>
                </View>

                {buildingReports.length === 0 ? (
                  <Text style={styles.modalEmptyText}>
                    No reports submitted for this building yet.
                  </Text>
                ) : (
                  buildingReports.map((report) => (
                    <View key={report.id} style={styles.modalRow}>
                      <Text style={styles.modalRowText}>{report.name}</Text>
                      <Text style={styles.modalRowMeta}>
                        {report.type} · Floor {report.floor} · {report.time}
                      </Text>
                      {report.description ? (
                        <Text style={styles.modalRowMeta}>
                          {report.description}
                        </Text>
                      ) : null}
                    </View>
                  ))
                )}

                <Text style={styles.modalSecurityCount}>
                  Total reports: {buildingReports.length}
                </Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <AuthRequiredModal
        visible={showAuthRequiredModal}
        onClose={() => setShowAuthRequiredModal(false)}
      />

      <ReportFormModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onSubmitSuccess={handleReportSubmitSuccess}
      />

      {demoMode && (
        <View style={styles.demoContainer}>
          <Text style={styles.demoLabel}>Demo Mode — Simulate Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["EV", "LB", "H", "FB", "JMSB"].map((b) => (
              <TouchableOpacity
                key={b}
                style={styles.demoButton}
                onPress={() => simulateNearBuilding(b)}
              >
                <Text style={styles.demoButtonText}>Near {b}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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
                    <Icon name="close" size={24} color="#276389" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalBuilding}>
                  {normalizeBuildingId(selectedReport.building)} · Floor{" "}
                  {selectedReport.floor}
                </Text>

                {selectedReport.isSevere && (
                  <View style={styles.severeIndicator}>
                    <TriangleAlert size={13} color="#F59E0B" />
                    <Text style={styles.severeIndicatorText}>
                      Marked Severe by Security
                    </Text>
                  </View>
                )}

                {selectedReport.description ? (
                  <Text style={styles.modalDescription}>
                    {selectedReport.description}
                  </Text>
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
                      {event.action === "verified" && `Verified by security`}
                      {event.action === "resolved" &&
                        `Marked resolved by ${
                          event.by === "security" ? "security" : "a concordian"
                        }`}
                      {event.action === "severe" && `Marked severe by security`}
                      <Text style={styles.timelineTime}> · {event.time}</Text>
                    </Text>
                  </View>
                ))}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <BottomNav onPressAdd={handleOpenReportFlow} />
    </SafeAreaView>
  );
}
