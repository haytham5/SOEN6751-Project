import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { bottomNavStyles as styles } from "../styles/bottomNavStyles";

const navItems = [
  {
    route: "/home",
    icon: require("../../assets/images/icons/home.png"),
    key: "home",
  },
  {
    route: "/events",
    icon: require("../../assets/images/icons/calendar.png"),
    key: "events",
  },
  {
    route: "/notifications",
    icon: require("../../assets/images/icons/bell.png"),
    key: "notifications",
  },
  {
    route: "/settings",
    icon: require("../../assets/images/icons/profile.png"),
    key: "profile",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#F7F9FF", "#FFFFFF", "#FFFFFF"]}
        style={styles.bottomNav}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, isActive && styles.activeNavItem]}
              onPress={() => router.replace(item.route as any)}
            >
              <Image
                source={item.icon}
                style={
                  isActive ? styles.activeNavIconImage : styles.navIconImage
                }
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}
