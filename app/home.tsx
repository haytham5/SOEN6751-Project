// import { useFonts } from "@expo-google-fonts/lexend";
// import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
// import * as NavigationBar from "expo-navigation-bar";
// import { useEffect, useRef, useState } from "react";
//
// import {
//   initialSubscriptions,
//   NotificationItem,
//   notifications,
// } from "./data/notificationData";
// import { getReports, Report } from "./data/reportSH";
//
// import {
//   Modal,
//   Pressable,
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Icon from "react-native-vector-icons/MaterialIcons";
//
// import BottomNav from "./components/bottomNav";
// import ReportFormModal from "./components/ReportFormModal";
// import { styles } from "./styles/indexStyles";
// import ViewShot, { captureRef } from "react-native-view-shot";
// import MapInfo from "./components/mapInfo";
//
// export default function Home() {
//   const [isMapExpanded, setIsMapExpanded] = useState(false);
//   const [isReportModalVisible, setIsReportModalVisible] = useState(false);
//
//   useEffect(() => {
//     NavigationBar.setBackgroundColorAsync("#F7F9FF");
//     NavigationBar.setButtonStyleAsync("dark");
//     NavigationBar.setBehaviorAsync("overlay-swipe");
//   }, []);
//
//   const [subscriptions] = useState(initialSubscriptions);
//
//   const activeBuildingIds = subscriptions
//       .filter((sub) => sub.isSubscribed)
//       .map((sub) => sub.id);
//
//   const visibleNotifications: NotificationItem[] = [...notifications]
//       .filter((notification) =>
//           activeBuildingIds.includes(notification.buildingId),
//       )
//       .sort((a, b) => b.minutesSinceMidnight - a.minutesSinceMidnight)
//       .slice(0, 3);
//
//   const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
//   const [buildingReports, setBuildingReports] = useState<Report[]>([]);
//   const [reports, setReports] = useState<Report[]>([]);
//   const [loadingReports, setLoading] = useState(true);
//
//   const handleMarkerPress = async (buildingId: string) => {
//     const allReports = await getReports();
//     const filtered = allReports.filter((r) => r.building === buildingId);
//     setBuildingReports(filtered);
//     setSelectedBuilding(buildingId);
//   };
//
//   const loadReports = async () => {
//     try {
//       const data = await getReports();
//       setReports(data);
//       console.log("Reports loaded:", data);
//     } catch (e) {
//       console.log("report load error", e);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     loadReports();
//   }, []);
//
//   const handleReportSubmitSuccess = async () => {
//     await loadReports();
//
//     if (selectedBuilding) {
//       const allReports = await getReports();
//       const filtered = allReports.filter((r) => r.building === selectedBuilding);
//       setBuildingReports(filtered);
//     }
//   };
//
//   const previewMapRef = useRef<MapView | null>(null);
//   const expandedMapRef = useRef<MapView | null>(null);
//
//   const onMapReady = (mapInstance: MapView | null) => {
//     if (!mapInstance) return;
//
//     mapInstance.setMapBoundaries(
//         { latitude: 45.5000284224813, longitude: -73.5759524037535 },
//         { latitude: 45.49070461581633, longitude: -73.58196697011486 },
//     );
//   };
//
//   const buildings: Record<string, { latitude: number; longitude: number }> = {
//     EV: { latitude: 45.49548608640669, longitude: -73.57806007167528 },
//     H: { latitude: 45.49721390474658, longitude: -73.57906858227709 },
//     JMSB: { latitude: 45.49515518152054, longitude: -73.57885668774541 },
//     LB: { latitude: 45.49677584482701, longitude: -73.57789645692377 },
//   };
//
//   const buildingCounts: Record<
//       string,
//       { protests: number; accessibility: number }
//   > = {};
//
//   reports.forEach((r) => {
//     if (!buildingCounts[r.building]) {
//       buildingCounts[r.building] = {
//         protests: 0,
//         accessibility: 0,
//       };
//     }
//
//     if (r.type === "accessibility") {
//       buildingCounts[r.building].accessibility++;
//     } else {
//       buildingCounts[r.building].protests++;
//     }
//   });
//
//   const bubbleRefs: Record<string, React.RefObject<ViewShot | null>> = {
//     EV: useRef<ViewShot | null>(null),
//     H: useRef<ViewShot | null>(null),
//     JMSB: useRef<ViewShot | null>(null),
//     LB: useRef<ViewShot | null>(null),
//   };
//
//   const [markerImages, setMarkerImages] = useState<Record<string, string>>({});
//
//   useEffect(() => {
//     const createMarkers = async () => {
//       const images: Record<string, string> = {};
//
//       for (const key of Object.keys(buildings)) {
//         const ref = bubbleRefs[key];
//
//         if (ref?.current) {
//           const uri = await captureRef(ref, {
//             format: "png",
//             quality: 1,
//           });
//
//           images[key] = uri;
//         }
//       }
//
//       setMarkerImages(images);
//     };
//
//     const timeout = setTimeout(createMarkers, 150);
//     return () => clearTimeout(timeout);
//   }, [reports]);
//
//   const [fontsLoaded] = useFonts({
//     Pacifico_400Regular,
//   });
//
//   if (!fontsLoaded || loadingReports) {
//     return null;
//   }
//
//   const mapRegion = {
//     latitude: 45.4973,
//     longitude: -73.579,
//     latitudeDelta: 0.005,
//     longitudeDelta: 0.005,
//   };
//
//   const renderMap = (mapRef: { current: MapView | null }) => {
//     return (
//         <MapView
//             style={styles.map}
//             initialRegion={mapRegion}
//             showsUserLocation
//             showsMyLocationButton
//             moveOnMarkerPress={false}
//             showsBuildings={false}
//             minZoomLevel={16}
//             maxZoomLevel={18}
//             ref={mapRef}
//             onMapReady={() => onMapReady(mapRef.current)}
//         >
//           {Object.keys(buildings).map((b) => {
//             const coord = buildings[b];
//
//             if (!markerImages[b]) return null;
//
//             return (
//                 <Marker
//                     key={b}
//                     coordinate={coord}
//                     image={{ uri: markerImages[b] }}
//                     anchor={{ x: 0.5, y: 1 }}
//                     onPress={() => handleMarkerPress(b)}
//                 />
//             );
//           })}
//         </MapView>
//     );
//   };
//
//   return (
//       <SafeAreaView style={styles.background}>
//         <ScrollView
//             contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
//             showsVerticalScrollIndicator={false}
//         >
//           <View style={{ position: "absolute", top: -9999, left: -9999 }}>
//             {Object.keys(buildings).map((b) => (
//                 <ViewShot key={b} ref={bubbleRefs[b]}>
//                   <MapInfo
//                       title={b}
//                       protests={buildingCounts[b]?.protests || 0}
//                       accessibility={buildingCounts[b]?.accessibility || 0}
//                   />
//                 </ViewShot>
//             ))}
//           </View>
//
//           <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
//
//           <View style={styles.header}>
//             <Text style={styles.title}>Home</Text>
//
//             <View style={styles.userCircle}>
//               <Icon name="person" size={20} color="white" />
//             </View>
//           </View>
//
//           <View style={styles.mapPreviewWrapper}>
//             {renderMap(previewMapRef)}
//
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 style={styles.mapPreviewOverlay}
//                 onPress={() => setIsMapExpanded(true)}
//             >
//               <Text style={styles.mapPreviewText}>Tap to expand map</Text>
//             </TouchableOpacity>
//
//             <TouchableOpacity
//                 style={styles.addReport}
//                 onPress={() => setIsReportModalVisible(true)}
//             >
//               <Icon name="add-circle" size={24} color="#276389" />
//             </TouchableOpacity>
//
//             <TouchableOpacity style={styles.reportFilters}>
//               <Icon name="filter-alt" size={24} color="#276389" />
//             </TouchableOpacity>
//
//             <TouchableOpacity style={styles.relaxMode}>
//               <Icon name="bedtime" size={24} color="#276389" />
//             </TouchableOpacity>
//           </View>
//
//           <Modal visible={isMapExpanded} animationType="slide">
//             <View style={styles.fullScreenContainer}>
//               {renderMap(expandedMapRef)}
//
//               <TouchableOpacity
//                   style={styles.closeButton}
//                   onPress={() => setIsMapExpanded(false)}
//               >
//                 <Icon name="close" size={28} color="#276389" />
//               </TouchableOpacity>
//
//               <TouchableOpacity
//                   style={styles.fullScreenAddReport}
//                   onPress={() => {
//                     setIsMapExpanded(false);
//                     setTimeout(() => setIsReportModalVisible(true), 150);
//                   }}
//               >
//                 <Icon name="add-circle" size={24} color="#276389" />
//               </TouchableOpacity>
//
//               <TouchableOpacity style={styles.fullScreenReportFilters}>
//                 <Icon name="filter-alt" size={24} color="#276389" />
//               </TouchableOpacity>
//
//               <TouchableOpacity style={styles.fullScreenRelaxMode}>
//                 <Icon name="bedtime" size={24} color="#276389" />
//               </TouchableOpacity>
//             </View>
//           </Modal>
//
//           <View style={styles.updatesSection}>
//             <View style={styles.updatesHeader}>
//               <Text style={styles.updatesTitle}>Your Updates</Text>
//               <Text style={styles.updatesSubtitle}>
//                 Subscribed reports and alerts
//               </Text>
//             </View>
//
//             {visibleNotifications.length > 0 ? (
//                 visibleNotifications.map((notification) => (
//                     <TouchableOpacity
//                         key={notification.id}
//                         activeOpacity={0.9}
//                         style={[
//                           styles.updateCard,
//                           notification.tone === "red"
//                               ? styles.updateCardRed
//                               : styles.updateCardGreen,
//                         ]}
//                     >
//                       <View style={styles.updateTopRow}>
//                         <Text style={styles.updateEventTitle}>
//                           {notification.eventName}
//                         </Text>
//
//                         <View
//                             style={[
//                               styles.updateBadge,
//                               notification.tone === "red"
//                                   ? styles.updateBadgeRed
//                                   : styles.updateBadgeGreen,
//                             ]}
//                         >
//                           <Text style={styles.updateBadgeText}>
//                             {notification.tone === "red" ? "High" : "Low"}
//                           </Text>
//                         </View>
//                       </View>
//
//                       <Text style={styles.updateBuilding}>
//                         {notification.buildingName}
//                       </Text>
//
//                       <Text style={styles.updateMeta}>{notification.timeAgo}</Text>
//                     </TouchableOpacity>
//                 ))
//             ) : (
//                 <View style={styles.emptyUpdatesState}>
//                   <Text style={styles.emptyUpdatesTitle}>
//                     No subscribed updates
//                   </Text>
//                   <Text style={styles.emptyUpdatesBody}>
//                     Turn on notifications for buildings to see alerts here.
//                   </Text>
//                 </View>
//             )}
//           </View>
//         </ScrollView>
//
//         <Modal
//             visible={selectedBuilding !== null}
//             transparent
//             animationType="fade"
//             onRequestClose={() => setSelectedBuilding(null)}
//         >
//           <Pressable
//               style={styles.modalOverlay}
//               onPress={() => setSelectedBuilding(null)}
//           >
//             <Pressable
//                 style={styles.modalCard}
//                 onPress={(e) => e.stopPropagation()}
//             >
//               {selectedBuilding && (
//                   <>
//                     <View style={styles.modalHeader}>
//                       <Text style={styles.modalTitle}>{selectedBuilding}</Text>
//                       <TouchableOpacity onPress={() => setSelectedBuilding(null)}>
//                         <Icon name="close" size={24} color="#276389" />
//                       </TouchableOpacity>
//                     </View>
//
//                     {buildingReports.length === 0 ? (
//                         <Text style={styles.modalEmptyText}>
//                           No reports submitted for this building yet.
//                         </Text>
//                     ) : (
//                         buildingReports.map((report) => (
//                             <View key={report.id} style={styles.modalRow}>
//                               <Text style={styles.modalRowText}>{report.name}</Text>
//                               <Text style={styles.modalRowMeta}>
//                                 {report.type} · Floor {report.floor} · {report.time}
//                               </Text>
//                               {report.description ? (
//                                   <Text style={styles.modalRowMeta}>
//                                     {report.description}
//                                   </Text>
//                               ) : null}
//                             </View>
//                         ))
//                     )}
//
//                     <Text style={styles.modalSecurityCount}>
//                       Total reports: {buildingReports.length}
//                     </Text>
//                   </>
//               )}
//             </Pressable>
//           </Pressable>
//         </Modal>
//
//         <ReportFormModal
//             visible={isReportModalVisible}
//             onClose={() => setIsReportModalVisible(false)}
//             onSubmitSuccess={handleReportSubmitSuccess}
//         />
//
//         <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
//       </SafeAreaView>
//   );
// }
import { useFonts } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  initialSubscriptions,
  NotificationItem,
  notifications,
} from "./data/notificationData";
import { getReports, Report } from "./data/reportSH";

import {
  Modal,
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

import BottomNav from "./components/bottomNav";
import ReportFormModal from "./components/ReportFormModal";
import { styles } from "./styles/indexStyles";
import ViewShot, { captureRef } from "react-native-view-shot";
import MapInfo from "./components/mapInfo";

export default function Home() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const [subscriptions] = useState(initialSubscriptions);

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
      setReports(data);

      if (selectedBuilding) {
        const filtered = data.filter((r) => r.building === selectedBuilding);
        setBuildingReports(filtered);
      }

      console.log("Reports loaded:", data);
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

  const previewMapRef = useRef<MapView | null>(null);
  const expandedMapRef = useRef<MapView | null>(null);

  const onMapReady = (mapInstance: MapView | null) => {
    if (!mapInstance) return;

    mapInstance.setMapBoundaries(
        { latitude: 45.5000284224813, longitude: -73.5759524037535 },
        { latitude: 45.49070461581633, longitude: -73.58196697011486 },
    );
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
            <Text style={styles.title}>Home</Text>

            <View style={styles.userCircle}>
              <Icon name="person" size={20} color="white" />
            </View>
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
                onPress={() => setIsReportModalVisible(true)}
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
                  onPress={() => {
                    setIsMapExpanded(false);
                    setTimeout(() => setIsReportModalVisible(true), 150);
                  }}
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

        <ReportFormModal
            visible={isReportModalVisible}
            onClose={() => setIsReportModalVisible(false)}
            onSubmitSuccess={handleReportSubmitSuccess}
        />

        <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
      </SafeAreaView>
  );
}