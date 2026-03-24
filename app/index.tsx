import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles as importStyles } from "./styles/userAuthStyles";
import { clearCurrentUser } from "./utils/authStorage";

import { useTheme } from "./data/themeProvider";

export default function Welcome() {
  const { theme } = useTheme();
  const styles = importStyles(theme);

  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar backgroundColor="#F7F9FF" barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.logoArea}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoBig}
            resizeMode="contain"
          />
          <Text style={styles.title}>Compass</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.push("../signin")}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => router.push("../signup")}
          >
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostButton}
            activeOpacity={0.7}
            onPress={async () => {
              await clearCurrentUser();
              router.push("../home");
            }}
          >
            <Text style={styles.ghostButtonText}>Continue without account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
