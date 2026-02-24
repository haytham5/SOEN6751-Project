import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./appStyles";
import BottomNav from "./components/bottomNav";

/**
 * TODO:
 * - Limit scrolling on map to school environs
 * - custom markers that display building name and numbers for reports
 * - Filter button
 * - add button
 */

export default function Index() {
  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);
  NavigationBar.setBehaviorAsync("overlay-swipe");

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <SafeAreaView style={styles.background}>
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
        >
          {/* <Polygon
            coordinates={[
              { latitude: 45.49716811115521, longitude: -73.579546473066 },
              { latitude: 45.497704051422694, longitude: -73.57903222820022 },
              { latitude: 45.49737047268203, longitude: -73.57833980200657 },
              { latitude: 45.49683769116792, longitude: -73.57884953594419 },
            ]}
            fillColor="rgba(39, 99, 137, 0.35)"
            strokeColor="#276389"
            strokeWidth={2}
          /> */}

          {/* <Marker
            coordinate={{ latitude: 45.4969, longitude: -73.5786 }}
            title="Hall Building"
          />
          <Marker
            coordinate={{ latitude: 45.4978, longitude: -73.5796 }}
            title="Library Building"
          />
          <Marker
            coordinate={{ latitude: 45.4965, longitude: -73.5799 }}
            title="EV Building"
          /> */}
        </MapView>

        <TouchableOpacity style={styles.addReport}>
          <Icon name="add-circle" size={24} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportFilters}>
          <Icon name="filter-alt" size={24} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.relaxMode}>
          <Icon name="all-inclusive" size={24} color="#276389" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
