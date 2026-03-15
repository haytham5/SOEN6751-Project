import { Platform, StyleSheet } from "react-native";

export const bottomNavStyles = StyleSheet.create({
    wrapper: {
        backgroundColor: "transparent",
    },

    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: "#DDE3EA",
        backgroundColor: "#FFFFFF",

        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
            },
            android: {
                elevation: 8,
            },
        }),
    },

    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },

    navIconImage: {
        width: 26,
        height: 26,
    },

    activeNavItem: {
        backgroundColor: "#EAF4FA",
        borderRadius: 16,
        paddingVertical: 10,
    },

    activeNavIconImage: {
        width: 28,
        height: 28,
    },
});