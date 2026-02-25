import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
import { styles } from "./styles/notificationsStyles";

export default function Notifications() {
  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
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

      <ScrollView contentContainerStyle={styles.scrollableContent}>
        {/* Header 1*/}
        <View style={styles.header}>
          <Text style={styles.title}>Your Subscriptions</Text>
        </View>

        {/* Building Tiles */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subscriptions}
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

        {/* Header 2*/}
        <View style={styles.header}>
          <Text style={styles.title}>Your Notifications</Text>
        </View>

        <View style={[styles.notification, styles.red]}>
          <Text style={styles.notificationBody}>
            <Text style={styles.bold}>EV1</Text> 11:15 AM: Protest Spotted
          </Text>
        </View>

        <View style={[styles.notification, styles.green]}>
          <Text style={styles.notificationBody}>
            <Text style={styles.bold}>LB1</Text> 12:00pm: Elevators out of Order
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
