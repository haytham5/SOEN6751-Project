import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import calmMapTheme from "./styles/calmMapTheme.json";

import { Lexend_400Regular, useFonts } from "@expo-google-fonts/lexend";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "./data/themeProvider";
import { styles as importStyles } from "./styles/calmStyles";
import { Themes } from "./styles/Themes";

import { getReports, Report } from "./data/reportSH";

import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MapView, { Circle } from "react-native-maps";

const today = new Date().toISOString().split("T")[0];

const buildingColorMap: Record<string, string> = {
  EV: "#FF9898",
  H: "#4CAF50",
  FB: "#a683eb",
  JMSB: "#2196F3",
  LB: "#FFC107",
};
const buildingColorMapOpacity: Record<string, string> = {
  EV: "#FF989830",
  H: "#4CAF5030",
  FB: "#a683eb30",
  JMSB: "#2196F330",
  LB: "#FFC10730",
};

export default function Calm() {
  const { theme } = useTheme();
  const scheme = Themes.dark;
  const styles = importStyles(scheme);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [originalReports, setOriginalReports] = useState<Report[]>([]);

  const previewMapRef = useRef<MapView | null>(null);
  const opacities = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReports();
        setReports(data);
        setOriginalReports(data);
      } catch (e) {
        console.log("calm load error", e);
      } finally {
        setLoadingReports(false);
      }
    };

    load();

    toggleInfo();
  }, []);

  const handleReset = () => {
    setReports(originalReports);

    originalReports.forEach((r) => {
      opacities.current[r.id] = new Animated.Value(1);
    });
  };

  const calmReports = useMemo(() => {
    return reports.filter(
      (r) => r.date === today && !r.isSevere && !r.isResolved,
    );
  }, [reports]);

  const renderRightActions = () => {
    return (
      <Animated.View style={[styles.card, styles.deleteCard]}>
        <Text style={[styles.title, { fontSize: 18 }]}>Remove</Text>
        <Text style={[styles.title, { fontSize: 18 }]}>Report</Text>
      </Animated.View>
    );
  };

  const handleRemove = (id: string) => {
    const opacity = opacities.current[id];
    if (!opacity) return;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start(() => {
      setReports((prev) => prev.filter((r) => r.id !== id));
      delete opacities.current[id];
    });
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const [showInfo, setShowInfo] = useState(false);

  const buildings: Record<string, { latitude: number; longitude: number }> = {
    EV: { latitude: 45.49548608640669, longitude: -73.57806007167528 },
    H: { latitude: 45.49721390474658, longitude: -73.57906858227709 },
    FB: { latitude: 45.4946, longitude: -73.5767 },
    LB: { latitude: 45.49677584482701, longitude: -73.57789645692377 },
    JMSB: { latitude: 45.49515518152054, longitude: -73.57885668774541 },
  };

  const mapRegion = {
    latitude: 45.4973,
    longitude: -73.579,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
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

  const renderMap = (mapRef: { current: MapView | null }) => {
    return (
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        toolbarEnabled={false}
        showsCompass={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        minZoomLevel={16}
        maxZoomLevel={18}
        ref={mapRef}
        onMapReady={() => onMapReady(mapRef.current)}
        customMapStyle={calmMapTheme}
      >
        {calmReports.map((report) => {
          const coord = buildings[report.building];

          if (!coord) return null;

          return (
            <Circle
              key={report.id}
              center={coord}
              radius={50}
              fillColor={buildingColorMapOpacity[report.building]}
              strokeColor={buildingColorMap[report.building]}
              strokeWidth={0}
            />
          );
        })}
      </MapView>
    );
  };

  const toggleInfo = () => {
    if (showInfo) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShowInfo(false));
    } else {
      setShowInfo(true);

      fadeAnim.setValue(0);
      translateY.setValue(-8);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }
  };

  if (!fontsLoaded || loadingReports) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={[scheme.white, scheme.softBg, scheme.white]}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={[styles.background, { backgroundColor: "transparent" }]}
        >
          <View style={styles.textRegion}>
            <View style={[styles.header, { justifyContent: "space-between" }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={toggleInfo}>
                  <Icon
                    style={{ marginTop: 2, marginEnd: 6 }}
                    name="bedtime"
                    size={24}
                    color="#276389"
                  />
                </TouchableOpacity>
                <Text style={styles.title}>Calm Mode</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>
              A Space to Relax with Simple Notifications.
            </Text>

            {showInfo && (
              <Animated.View
                style={{
                  marginBottom: 10,
                  padding: 12,
                  paddingBottom: 6,
                  borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  opacity: fadeAnim,
                  transform: [{ translateY }],
                }}
              >
                <Text style={[styles.subtitle, { fontSize: 12 }]}>
                  • Swipe reports to remove them
                </Text>
                <Text style={[styles.subtitle, { fontSize: 12 }]}>
                  • Areas you keep will be highlighted on the map
                </Text>
                <Text style={[styles.subtitle, { fontSize: 12 }]}>
                  • You’ll be notified when selected reports are resolved
                </Text>
                <Text style={[styles.subtitle, { fontSize: 12 }]}>
                  • Click the Moon to dismiss this dialog
                </Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.mapPreviewWrapper}>
            {renderMap(previewMapRef)}
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 0 }}
            showsVerticalScrollIndicator={false}
          >
            {calmReports.length === 0 ? (
              <Text style={styles.subtitle}>No disruptions right now.</Text>
            ) : (
              calmReports.map((report) => {
                if (!opacities.current[report.id]) {
                  opacities.current[report.id] = new Animated.Value(1);
                }

                return (
                  <Swipeable
                    key={report.id}
                    onSwipeableWillOpen={() => setActiveRow(report.id)}
                    ref={(ref) => {
                      if (activeRow !== report.id && ref) {
                        ref.close();
                      }
                    }}
                    renderRightActions={renderRightActions}
                    onSwipeableOpen={() => handleRemove(report.id)}
                    containerStyle={{ opacity: opacities.current[report.id] }}
                  >
                    <Animated.View style={styles.card}>
                      <View style={styles.cardTextTopRow}>
                        <Icon
                          name={
                            report.type === "protest"
                              ? "campaign"
                              : "accessible"
                          }
                          size={28}
                          color="#fff"
                        />

                        <Text style={[styles.cardText, { fontWeight: "600" }]}>
                          {report.name}
                        </Text>
                      </View>

                      <Text style={styles.cardText}>
                        {report.building} {report.floor} · {report.time}
                      </Text>
                    </Animated.View>
                  </Swipeable>
                );
              })
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.ghostButton}
            activeOpacity={0.7}
            onPress={handleReset}
          >
            <Text style={styles.ghostButtonText}>Reset Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostButton}
            activeOpacity={0.7}
            onPress={async () => {
              router.push("../home");
            }}
          >
            <Text style={styles.ghostButtonText}>Return to Normal Mode</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
