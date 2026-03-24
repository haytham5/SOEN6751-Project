import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { bottomNavStyles as importStyles } from "../styles/bottomNavStyles";
import { getCurrentUser } from "../utils/authStorage";
import AuthRequiredModal from "./authRequiredModel";

import { Binoculars, Calendar, House, Plus, User } from "lucide-react-native";
import { useTheme } from "../data/themeProvider";

interface BottomNavProps {
  onPressAdd?: () => void;
}

const navItems = [
  { route: "/home", icon: House, key: "home" },
  { route: "/events", icon: Calendar, key: "events" },
  { route: "/create", icon: Plus, key: "create" },
  { route: "/notifications", icon: Binoculars, key: "notifications" },
  { route: "/settings", icon: User, key: "profile" },
];

export default function BottomNav({ onPressAdd }: BottomNavProps) {
  const { theme } = useTheme();
  const scheme = theme;
  const styles = importStyles(scheme);

  const router = useRouter();
  const pathname = usePathname();
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

  const handleCreatePress = async () => {
    const currentUser = await getCurrentUser();
    const isLoggedIn = currentUser && !currentUser.isGuest;

    if (!isLoggedIn) {
      setShowAuthRequiredModal(true);
      return;
    }

    if (onPressAdd) {
      onPressAdd();
    }
  };

  return (
      <>
        <View style={styles.wrapper}>
          <LinearGradient
              colors={[scheme.softBg, scheme.white, scheme.white]}
              style={styles.bottomNav}
          >
            {navItems.map((item) => {
              const isCreate = item.key === "create";
              const isActive = !isCreate && pathname === item.route;
              const Icon = item.icon;

              if (isCreate) {
                return (
                    <TouchableOpacity
                        key={item.key}
                        style={styles.createNavItem}
                        onPress={handleCreatePress}
                        activeOpacity={0.85}
                    >
                      <View style={styles.createButton}>
                        <Plus size={28} color={scheme.white} strokeWidth={2.5} />
                      </View>
                    </TouchableOpacity>
                );
              }

              return (
                  <TouchableOpacity
                      key={item.key}
                      style={[styles.navItem, isActive && styles.activeNavItem]}
                      onPress={() => {
                        if (!isActive) {
                          router.replace(item.route as any);
                        }
                      }}
                      disabled={isActive}
                      activeOpacity={isActive ? 1 : 0.85}
                  >
                    <Icon
                        size={26}
                        color={isActive ? scheme.black : scheme.iconInactive}
                        strokeWidth={2}
                    />
                  </TouchableOpacity>
              );
            })}
          </LinearGradient>
        </View>

        <AuthRequiredModal
            visible={showAuthRequiredModal}
            onClose={() => setShowAuthRequiredModal(false)}
        />
      </>
  );
}