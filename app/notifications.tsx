import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./appStyles";
import BottomNav from "./components/bottomNav";

export default function Notifications() {
  const router = useRouter();

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
        <Text style={styles.title}>Your Subscriptions</Text>
      </View>

      {/* Building Tiles */}
      <View style={styles.mapWrapper}></View>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
