// Import the Pacifico font and the hook used to load fonts
import { useFonts } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";

// Shows a loading screen while fonts are loading

// Lets us customize the Android navigation bar
import * as NavigationBar from "expo-navigation-bar";

// React hooks:
// useEffect -> run code when component loads / updates
// useRef -> keep a reference to something without causing re-renders
// useState -> store values that can change over time
import { useEffect, useRef, useState } from "react";

import {
  initialSubscriptions,
  NotificationItem,
  notifications,
} from "./data/notificationData";

import { getReports, Report } from "./data/reportSH";

// React Native UI components
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// MapView = the map itself
// Marker = icons / markers placed on the map
import MapView, { Marker } from "react-native-maps";

// SafeAreaView helps avoid overlapping with phone notch / status bar
import { SafeAreaView } from "react-native-safe-area-context";

// Icon library
import Icon from "react-native-vector-icons/MaterialIcons";

// Bottom navigation bar component
import BottomNav from "./components/bottomNav";

// Styles for this page
import { styles } from "./styles/indexStyles";

// ViewShot lets us "take a picture" of a React Native view
import ViewShot, { captureRef } from "react-native-view-shot";

// Custom component used inside the marker image
import { useRouter } from "expo-router";
import MapInfo from "./components/mapInfo";

export default function Home() {
  /**
   * STATE: isMapExpanded
   * This stores whether the full-screen map modal is open or not.
   *
   * false = map is only shown as a small preview card
   * true  = full-screen modal map is visible
   */
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const router = useRouter();

  /**
   * useEffect with [] runs only once when the component first loads.
   * We use it to configure the Android navigation bar.
   */
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  // subscription state
  const [subscriptions] = useState(initialSubscriptions);
  // visible notifications
  const activeBuildingIds = subscriptions
    .filter((sub) => sub.isSubscribed)
    .map((sub) => sub.id);

  const visibleNotifications: NotificationItem[] = [...notifications]
    .filter((notification) =>
      activeBuildingIds.includes(notification.buildingId),
    )
    .sort((a, b) => b.minutesSinceMidnight - a.minutesSinceMidnight)
    .slice(0, 3);

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [buildingReports, setBuildingReports] = useState<Report[]>([]);

  const handleMarkerPress = async (buildingId: string) => {
    const allReports = await getReports();
    const filtered = allReports.filter((r) => r.building === buildingId);
    setBuildingReports(filtered);
    setSelectedBuilding(buildingId);
  };

  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getReports();
        setReports(data);
        console.log("Reports loaded:", data);
      } catch (e) {
        console.log("report load error", e);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  /**
   * REFS FOR THE MAPS
   *
   * We have TWO maps:
   * 1. the small preview map on the main page
   * 2. the full-screen map inside the modal
   *
   * useRef lets us keep a reference to each map instance.
   * That way, we can directly call map methods on them.
   *
   * MapView | null means:
   * - at first, the ref is null (because the map is not mounted yet)
   * - later, it becomes a MapView instance
   */
  const previewMapRef = useRef<MapView | null>(null);
  const expandedMapRef = useRef<MapView | null>(null);

  /**
   * This function runs when a map is ready.
   * It receives a map instance and sets boundaries,
   * which restricts how far the user can move around the map.
   *
   * If mapInstance is null, we stop immediately.
   */
  const onMapReady = (mapInstance: MapView | null) => {
    if (!mapInstance) return;

    mapInstance.setMapBoundaries(
      // one corner of the allowed map area
      { latitude: 45.5000284224813, longitude: -73.5759524037535 },

      // opposite corner of the allowed map area
      { latitude: 45.49070461581633, longitude: -73.58196697011486 },
    );
  };

  const buildings: Record<string, { latitude: number; longitude: number }> = {
    EV: { latitude: 45.49548608640669, longitude: -73.57806007167528 },
    H: { latitude: 45.49721390474658, longitude: -73.57906858227709 },
    JMSB: { latitude: 45.49515518152054, longitude: -73.57885668774541 },
    LB: { latitude: 45.49677584482701, longitude: -73.57789645692377 },
  };

  const buildingCounts: any = {};

  reports.forEach((r) => {
    if (!buildingCounts[r.building]) {
      buildingCounts[r.building] = {
        protests: 0,
        accessibility: 0,
      };
    }

    if (r.type === "accessibility") buildingCounts[r.building].accessibility++;
    else buildingCounts[r.building].protests++;
  });

  const bubbleRefs: any = {
    EV: useRef(null),
    H: useRef(null),
    JMSB: useRef(null),
    LB: useRef(null),
  };

  const [markerImages, setMarkerImages] = useState<any>({});

  useEffect(() => {
    const createMarkers = async () => {
      const images: any = {};

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

    setTimeout(createMarkers, 150);
  }, [reports]);

  /**
   * REF FOR THE HIDDEN MARKER VIEW
   *
   * bubbleRef points to the ViewShot component.
   * That ViewShot wraps a MapInfo component that we want to turn into an image.
   *
   * Why?
   * Because the Marker component can display an image,
   * and we want a custom marker design.
   */
  // const bubbleRef = useRef<ViewShot | null>(null);

  // /**
  //  * STATE: markerImage
  //  * Stores the URI/path of the generated marker image.
  //  *
  //  * null means the image has not been created yet.
  //  * string means the image exists and can be used in <Marker image={{ uri: ... }} />
  //  */
  // const [markerImage, setMarkerImage] = useState<string | null>(null);

  // /**
  //  * This effect creates the custom marker image after the component loads.
  //  *
  //  * Steps:
  //  * 1. Wait a tiny bit so the hidden ViewShot content has time to render
  //  * 2. Capture the ViewShot as an image
  //  * 3. Save the image URI in state
  //  *
  //  * The timeout is cleaned up when the component unmounts.
  //  */
  // useEffect(() => {
  //   const createMarker = async () => {
  //     // If the hidden view isn't ready yet, do nothing
  //     if (!bubbleRef.current) return;

  //     try {
  //       // Capture the hidden ViewShot and return the image URI
  //       const uri = await captureRef(bubbleRef.current, {
  //         format: "png",
  //         quality: 1,
  //       });

  //       // Save that image path into state
  //       setMarkerImage(uri);
  //     } catch (error) {
  //       console.log("Error creating marker image:", error);
  //     }
  //   };

  //   // Small delay to make sure the hidden content is rendered first
  //   const timeout = setTimeout(createMarker, 150);

  //   // Cleanup
  //   return () => clearTimeout(timeout);
  // }, []);

  /**
   * Load custom fonts.
   * fontsLoaded becomes true once the font is ready.
   */
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  /**
   * If the fonts are not ready yet,
   * show a loading screen instead of rendering the page.
   */
  if (!fontsLoaded || loadingReports) {
    return null;
  }

  /**
   * Base region for the map.
   *
   * latitude + longitude = center of the map
   * latitudeDelta + longitudeDelta = zoom level / visible area
   */
  const mapRegion = {
    latitude: 45.4973,
    longitude: -73.579,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  /**
   * HELPER FUNCTION: renderMap
   *
   * Instead of repeating the same <MapView> code twice
   * (once for preview and once for full-screen),
   * we put the map JSX in a function and reuse it.
   *
   * It receives a ref so we can attach the correct map reference.
   * 
   *   const renderMap = (mapRef: React.RefObject<MapView | null>) => (
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
           Only show the marker after the custom image has been created
          {markerImage && (
              <Marker
                  style={styles.marker}
                  coordinate={{
                      latitude: 45.4954860561696,
                      longitude: -73.57820980509946,
                  }}
                  image={{ uri: markerImage }}
                  anchor={{ x: 0.5, y: 1 }}
              />
          )}
      </MapView>
  );
   */

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/*
        HIDDEN MARKER RENDER

        This view is placed off-screen so the user never sees it.
        Its only purpose is to render the MapInfo component,
        then capture it as an image using ViewShot.
      */}
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

        {/* Top phone status bar styling */}
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>

          <View style={styles.userCircle}>
            <Icon name="person" size={20} color="white" />
          </View>
        </View>

        {/*
        SMALL CLICKABLE MAP PREVIEW

        This is the rectangle/card shown on the main page.
        The whole thing is wrapped in TouchableOpacity,
        so tapping it opens the full-screen map.
      */}
        <View style={styles.mapPreviewWrapper}>
          {/* Render the smaller preview map */}
          {renderMap(previewMapRef)}

          {/* Small label on top of the preview map */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mapPreviewOverlay}
            onPress={() => setIsMapExpanded(true)}
          >
            <Text style={styles.mapPreviewText}>Tap to expand map</Text>
          </TouchableOpacity>

          {/* Floating action buttons on top of the preview map */}
          <TouchableOpacity
            style={styles.addReport}
            onPress={() => router.replace("/addReport")}
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

        {/*
        FULL-SCREEN MAP MODAL

        A Modal is like a screen that appears on top of the current one.
        It becomes visible only when isMapExpanded === true
      */}
        <Modal visible={isMapExpanded} animationType="slide">
          <View style={styles.fullScreenContainer}>
            {/* Render the full-screen version of the map */}
            {renderMap(expandedMapRef)}

            {/* Close button in the top-right corner */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsMapExpanded(false)}
            >
              <Icon name="close" size={28} color="#276389" />
            </TouchableOpacity>

            {/* Floating buttons for the full-screen map */}
            <TouchableOpacity
              style={styles.fullScreenAddReport}
              onPress={() => router.replace("/addReport")}
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

        {/* Bottom navigation always stays on the main page */}

        <View style={styles.updatesSection}>
          <View style={styles.updatesHeader}>
            <Text style={styles.updatesTitle}>Your Updates</Text>
            <Text style={styles.updatesSubtitle}>
              Subscribed reports and alerts
            </Text>
          </View>

          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                activeOpacity={0.9}
                style={[
                  styles.updateCard,
                  notification.tone === "red"
                    ? styles.updateCardRed
                    : styles.updateCardGreen,
                ]}
              >
                <View style={styles.updateTopRow}>
                  <Text style={styles.updateEventTitle}>
                    {notification.eventName}
                  </Text>

                  <View
                    style={[
                      styles.updateBadge,
                      notification.tone === "red"
                        ? styles.updateBadgeRed
                        : styles.updateBadgeGreen,
                    ]}
                  >
                    <Text style={styles.updateBadgeText}>
                      {notification.tone === "red" ? "High" : "Low"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.updateBuilding}>
                  {notification.buildingName}
                </Text>

                <Text style={styles.updateMeta}>{notification.timeAgo}</Text>
              </TouchableOpacity>
            ))
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

      <BottomNav />
    </SafeAreaView>
  );
}
