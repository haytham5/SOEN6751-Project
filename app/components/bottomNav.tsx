import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { bottomNavStyles as styles } from "../styles/bottomNavStyles";

import { House, Calendar, Plus, Bell, User } from "lucide-react-native";

const navItems = [
  { route: "/home", icon: House, key: "home" },
  { route: "/events", icon: Calendar, key: "events" },
  { route: "/create", icon: Plus, key: "create" },
  { route: "/notifications", icon: Bell, key: "notifications" },
  { route: "/settings", icon: User, key: "profile" },
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
            const Icon = item.icon;

            return (
                <TouchableOpacity
                    key={item.key}
                    style={[styles.navItem, isActive && styles.activeNavItem]}
                    onPress={() => router.replace(item.route as any)}
                >
                  <Icon
                      size={26}
                      color={isActive ? "#1B1B1B" : "#A0A0A0"}
                      strokeWidth={2}
                  />
                </TouchableOpacity>
            );
          })}
        </LinearGradient>
      </View>
  );
}