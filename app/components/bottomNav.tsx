import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "../styles/indexStyles";

export default function BottomNav() {
  const router = useRouter();

  return (
    <View>
      <LinearGradient
        colors={["#F7F9FF", "#FFFFFF", "#FFFFFF"]}
        style={styles.bottomNav}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/")}
        >
          <Icon name="home" size={26} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("../events")}
        >
          <Icon name="calendar-month" size={26} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/notifications")}
        >
          <Icon name="notifications" size={26} color="#276389" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("../settings")}
        >
          <Icon name="settings" size={26} color="#276389" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
