import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { bottomNavStyles as styles } from "../styles/bottomNavStyles";
import { getCurrentUser } from "../utils/authStorage";
import AuthRequiredModal from "./authRequiredModel";

import { Binoculars, Calendar, House, Plus, User } from "lucide-react-native";

interface BottomNavProps {
    onPressAdd?: () => void;
}

const navItems = [
    { route: "/home",          icon: House,       key: "home"          },
    { route: "/events",        icon: Calendar,    key: "events"        },
    { route: "/create",        icon: Plus,        key: "create"        },
    { route: "/notifications", icon: Binoculars,  key: "notifications" },
    { route: "/settings",      icon: User,        key: "profile"       },
];

export default function BottomNav({ onPressAdd }: BottomNavProps) {
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
                    colors={["#FFFFFF", "#FFFFFF", "#F9FAFB"]}
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
                                        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
                                    </View>
                                </TouchableOpacity>
                            );
                        }

                        return (
                            <TouchableOpacity
                                key={item.key}
                                style={[styles.navItem, isActive && styles.activeNavItem]}
                                onPress={() => router.replace(item.route as any)}
                                activeOpacity={0.85}
                            >
                                <Icon
                                    size={26}
                                    color={isActive ? "#111111" : "#8E8E98"}
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