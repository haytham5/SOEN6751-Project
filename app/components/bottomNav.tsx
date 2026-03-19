import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { bottomNavStyles } from "../styles/bottomNavStyles";

import { Bell, Calendar, House, Plus, User } from "lucide-react-native";

import { Themes } from "../styles/Themes";

interface BottomNavProps {
  onPressAdd?: () => void;
}

const navItems = [
  { route: "/home", icon: House, key: "home" },
  { route: "/events", icon: Calendar, key: "events" },
  { route: "/create", icon: Plus, key: "create" },
  { route: "/notifications", icon: Bell, key: "notifications" },
  { route: "/settings", icon: User, key: "profile" },
];

export default function BottomNav({ onPressAdd }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const scheme = "dark";
  const theme = scheme === "dark" ? Themes.dark : Themes.light;

  const styles = bottomNavStyles(theme);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[theme.surfaceSoft, theme.background, theme.background]}
        style={styles.bottomNav}
      >
        {navItems.map((item) => {
          const isCreate = item.key === "create";
          const isActive = !isCreate && pathname === item.route;
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, isActive && styles.activeNavItem]}
              onPress={() => {
                if (isCreate) {
                  onPressAdd?.();
                } else {
                  router.replace(item.route as any);
                }
              }}
            >
              <Icon
                size={26}
                color={isActive ? theme.textPrimary : theme.textLight}
                strokeWidth={2}
              />
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}
