import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useRef, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNav from "./components/bottomNav";
import { styles } from "./styles/indexStyles";

import ViewShot, { captureRef } from "react-native-view-shot";
import MapInfo from "./components/mapInfo";

/**
 * TODO:
 * - Filter button
 * - add button
 * tie calm mode to settings, as a baseline remove info to a premade filter + make a preferred color
 * - dark mode
 * - lower map size to 50%, and if you click then it becomes bigger
 */

export default function Index() {
  // Style Navbar
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);
  NavigationBar.setBehaviorAsync("overlay-swipe");

  //Map Refs
  const mapRef = useRef<MapView | null>(null);

  const onMapReady = () => {
    mapRef.current &&
      mapRef.current.setMapBoundaries(
        { latitude: 45.5000284224813, longitude: -73.5759524037535 },
        { latitude: 45.49070461581633, longitude: -73.58196697011486 },
      );
  };

  // Marker Image
  const bubbleRef = useRef(null);
  const [markerImage, setMarkerImage] = useState<string | null>(null);

  useEffect(() => {
    const createMarker = async () => {
      const uri = await captureRef(bubbleRef, {
        format: "png",
        quality: 1,
      });

      setMarkerImage(uri);
    };

    setTimeout(createMarker, 100);
  }, []);

  // Load Fonts
  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <SafeAreaView style={styles.background}>
      {/* Load Marker Image In View */}
      <View
        style={{
          position: "absolute",
          top: -9999,
          left: -9999,
        }}
      >
        <ViewShot ref={bubbleRef}>
          <MapInfo title="EV" protests={11} accessibility={3} />
        </ViewShot>
      </View>

      {/* Status Bar */}
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Map</Text>

        <View style={styles.userCircle}>
          <Icon name="person" size={20} color="white" />
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 45.4973,
            longitude: -73.579,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation
          showsMyLocationButton
          moveOnMarkerPress={false}
          showsBuildings={false}
          minZoomLevel={16}
          maxZoomLevel={18}
          ref={mapRef}
          onMapReady={onMapReady}
        >
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

        <TouchableOpacity style={styles.addReport}>
          <Icon name="add-circle" size={24} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportFilters}>
          <Icon name="filter-alt" size={24} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.relaxMode}>
          <Icon name="bedtime" size={24} color="#276389" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
