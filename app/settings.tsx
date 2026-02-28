import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
import { styles } from "./styles/settingsStyles";

interface RowProps {
  label: string;
  value: boolean | undefined;
  onChange: ((value: boolean) => void | Promise<void>) | null | undefined;
}

export default function Settings() {
  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const [lightMode, setLightMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [accessibility, setAccessibility] = useState(true);

  const SettingRow = ({ label, value, onChange }: RowProps) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#ccc", true: "#b39ddb" }}
        thumbColor="#ffffff"
      />
    </View>
  );

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
      {/* Header 1*/}
      <View style={styles.header}>
        <Text style={styles.title}>Your Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollableContent}>
        <SettingRow
          label="Light Mode"
          value={lightMode}
          onChange={setLightMode}
        />

        <SettingRow
          label="Notifications"
          value={notifications}
          onChange={setNotifications}
        />

        <SettingRow
          label="Accessibility"
          value={accessibility}
          onChange={setAccessibility}
        />

        <TouchableOpacity style={styles.logout}>
          <Text style={(styles.label, styles.logoutLabel)}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
