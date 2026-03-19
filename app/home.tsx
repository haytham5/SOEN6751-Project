import { useFonts } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import AuthRequiredModal from "./components/authRequiredModel";
import NearBuildingBanner from "./components/NearBuildingBanner";
import {
  initialSubscriptions,
  testReports,
} from "./data/notificationData";
import { simulateNearBuilding } from "./utils/simulateGeofence";


import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

import ViewShot, { captureRef } from "react-native-view-shot";
import BottomNav from "./components/bottomNav";
import MapInfo from "./components/mapInfo";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import { styles } from "./styles/indexStyles";
import { getCurrentUser } from "./utils/authStorage";

import { CheckCircle, ThumbsUp } from "lucide-react-native";
import { getReports, markReportResolved, Report, upvoteReport, verifyReport } from "./data/reportSH";

  const buildingColorMap: Record<string, string> = {
    EV: "#FF9898",
    H: "#4CAF50",
    JMSB: "#2196F3",
    LB: "#FFC107",
  };

export default function Home() {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const buildingColorMap: Record<string, string> = {
    EV: "#FF9898",
    H: "#4CAF50",
    JMSB: "#2196F3",
    LB: "#FFC107",
  };

  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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

    // add handler function:
    const handleVerify = async (reportId: string) => {
      if (currentUserRole !== "security") return;
      await verifyReport(reportId);
      await loadReports();
    };

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const [subscriptions] = useState(initialSubscriptions);

  const activeBuildingIds = subscriptions
      .filter((sub) => sub.isSubscribed)
      .map((sub) => sub.id);

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [buildingReports, setBuildingReports] = useState<Report[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoading] = useState(true);

  const handleMarkerPress = async (buildingId: string) => {
    const allReports = await getReports();
    const filtered = allReports.filter((r) => r.building === buildingId);
    setBuildingReports(filtered);
    setSelectedBuilding(buildingId);
  };

  const loadReports = useCallback(async () => {
    try {
      const data = await getReports();
      const combined = [...testReports, ...data]; 
      setReports(combined);

      if (selectedBuilding) {
        const filtered = combined.filter((r) => r.building === selectedBuilding);
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
        loadReports();
      }, [loadReports]),
  );

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
    await markReportResolved(reportId, currentUserId);
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

  const previewMapRef = useRef<MapView | null>(null);
  const expandedMapRef = useRef<MapView | null>(null);

  const onMapReady = (mapInstance: MapView | null) => {
    if (!mapInstance) return;

    if (Platform.OS === "android") {
      mapInstance.setMapBoundaries(
          { latitude: 45.5000284224813, longitude: -73.5759524037535 },
          { latitude: 45.49070461581633, longitude: -73.58196697011486 },
      );
    }
  };

  const buildings: Record<string, { latitude: number; longitude: number }> = {
    EV: { latitude: 45.49548608640669, longitude: -73.57806007167528 },
    H: { latitude: 45.49721390474658, longitude: -73.57906858227709 },
    JMSB: { latitude: 45.49515518152054, longitude: -73.57885668774541 },
    LB: { latitude: 45.49677584482701, longitude: -73.57789645692377 },
  };

  const buildingCounts: Record<
      string,
      { protests: number; accessibility: number }
  > = {};

  reports.forEach((r) => {
    if (!buildingCounts[r.building]) {
      buildingCounts[r.building] = {
        protests: 0,
        accessibility: 0,
      };
    }

    if (r.type === "accessibility") {
      buildingCounts[r.building].accessibility++;
    } else {
      buildingCounts[r.building].protests++;
    }
  });

  const bubbleRefs: Record<string, React.RefObject<ViewShot | null>> = {
    EV: useRef<ViewShot | null>(null),
    H: useRef<ViewShot | null>(null),
    JMSB: useRef<ViewShot | null>(null),
    LB: useRef<ViewShot | null>(null),
  };

  const [markerImages, setMarkerImages] = useState<Record<string, string>>({});

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
                Subscribed reports and alerts
              </Text>
            </View>

            {reports.filter((r) => activeBuildingIds.includes(r.building) && !r.isScheduledEvent)
              .slice(0, 5)
              .length > 0 ? (
              reports
                .filter((r) => activeBuildingIds.includes(r.building) && !r.isScheduledEvent)
                .slice(0, 5)
                .map((report) => {
                  const hasUpvoted = currentUserId
                    ? report.upvotedBy?.includes(currentUserId)
                    : false;
                  const isResolved = report.isResolved;
                  const isDisabled = isGuest || !currentUserId;

                  const typeIcon = report.type === "accessibility"
                    ? "accessible"
                    : "campaign";

                  const typeLabel = report.accessibilitySubtype
                    ? report.accessibilitySubtype.replace("_", " ")
                    : report.type;

                  const submitterLabel = report.submittedBy === "security"
                    ? "security"
                    : "a concordian";

                  return (
                    <View
                      key={report.id}
                      style={[
                        styles.updateCard,
                        { borderLeftColor: buildingColorMap[report.building] ?? "#DDE3EA" }
                      ]}
                    >
                      {/* Left content + Right buttons */}
                      <View style={styles.updateCardInner}>

                        {/* LEFT SIDE */}
                        <View style={styles.updateCardLeft}>

                          {/* Title */}
                          <Text style={styles.updateEventTitle}>
                            {report.name || report.type}
                          </Text>

                          {/* Time */}
                          <Text style={styles.updateMeta}>
                            {report.time} · {report.date}
                          </Text>

                          {/* Type icon + label */}
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

                          {/* Reported by + verified */}
                          <View style={styles.updateReporterRow}>
                            <Text style={styles.updateMeta}>
                              Reported by {submitterLabel}
                            </Text>
                            {report.isVerifiedBySecurity && (
                              <View style={styles.verifiedBadge}>
                                <Icon name="check-circle" size={13} color="#1FA64A" />
                                <Text style={styles.verifiedText}>Verified</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        {/* RIGHT SIDE — upvote + resolve buttons */}
                        <View style={styles.updateCardActions}>

                          {/* Upvote button */}
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              (hasUpvoted || isDisabled) && styles.actionButtonDisabled,
                            ]}
                            onPress={() => handleUpvote(report.id)}
                            disabled={hasUpvoted || isDisabled}
                          >
                            <ThumbsUp
                              size={18}
                              color={hasUpvoted || isDisabled ? "#aaa" : "#276389"}
                            />
                            <Text style={[
                              styles.actionCount,
                              (hasUpvoted || isDisabled) && styles.actionCountDisabled,
                            ]}>
                              {report.upvotedBy?.length ?? 0}
                            </Text>
                          </TouchableOpacity>

                          {/* Resolve button */}
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              (isResolved || isDisabled) && styles.actionButtonDisabled,
                            ]}
                            onPress={() => handleResolve(report.id)}
                            disabled={isResolved || isDisabled}
                          >
                            <CheckCircle
                              size={18}
                              color={isResolved || isDisabled ? "#aaa" : "#276389"}
                            />
                            <Text style={[
                              styles.actionCount,
                              (isResolved || isDisabled) && styles.actionCountDisabled,
                            ]}>
                              {isResolved ? "✓" : "0"}
                            </Text>
                          </TouchableOpacity>

                        </View>
                      </View>
                    </View>
                  );
                })
            ) : (
              <View style={styles.emptyUpdatesState}>
                <Text style={styles.emptyUpdatesTitle}>
                  No subscribed updates
                </Text>
                <Text style={styles.emptyUpdatesBody}>
                  Turn on notifications for buildings to see alerts here.
                </Text>
              </View>
            )}
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
                {["EV", "LB", "H", "JMSB"].map((b) => (
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

        <BottomNav onPressAdd={handleOpenReportFlow} />
      </SafeAreaView>
  );
}