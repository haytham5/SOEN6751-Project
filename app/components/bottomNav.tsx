import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { bottomNavStyles as styles } from "../styles/bottomNavStyles";

import { House, Calendar, Plus, Bell, User } from "lucide-react-native";

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

    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={["#F7F9FF", "#FFFFFF", "#FFFFFF"]}
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