import { Platform, StyleSheet } from "react-native";
import { ThemeType } from "../data/themeProvider";

export const styles = (COLORS: ThemeType) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: COLORS.white,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textRegion: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },

    header: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 8,
      paddingTop: 20,
      paddingHorizontal: 20,
      gap: 10,
      animationDuration: 10,
    },

    title: {
      fontSize: 28,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      letterSpacing: -0.4,
    },

    subtitle: {
      fontSize: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,

      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      lineHeight: 20,
    },

    ghostButton: {
      alignItems: "center",
      paddingVertical: 12,
    },

    ghostButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.subtext,
      textDecorationLine: "underline",
    },

    card: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      paddingHorizontal: 18,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: COLORS.border,

      flexDirection: "column",
      alignItems: "center",
      gap: 12,
    },

    cardTitle: {
      fontFamily: "Lexend_400Regular",
      fontSize: 22,
      color: COLORS.black,
      marginBottom: 4,
    },

    cardTextTopRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    cardText: {
      flexShrink: 1,
      fontSize: 17,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      marginLeft: 12,
      overflow: "scroll",
    },

    deleteCard: {
      backgroundColor: COLORS.pinkTint,
      marginRight: 2,
    },

    map: {
      width: "100%",
      height: "100%",
    },

    mapPreviewWrapper: {
      height: 255,
      width: "90%",
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: COLORS.softBg,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: COLORS.border,
      position: "relative",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.07,
          shadowRadius: 18,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    updatesTitle: {
      fontSize: 23,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      marginBottom: 4,
      letterSpacing: -0.3,
      marginTop: -2,
    },

    tooltip: {
      marginTop: 10,
      padding: 12,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.08)",
      marginBottom: 12,
    },

    tooltipButton: {
      position: "absolute",
      bottom: 18,
      right: 15,
      backgroundColor: COLORS.white,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    tabContainer: {
      flexDirection: "row",
      backgroundColor: COLORS.softBg,
      marginHorizontal: 20,
      marginTop: -7,
      marginBottom: 12,
      borderRadius: 18,
      padding: 4,
      borderWidth: 1,
      borderColor: COLORS.border,

      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.07,
          shadowRadius: 18,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    tabButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },

    activeTabButton: {
      backgroundColor: COLORS.cardBg,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    tabButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: COLORS.subtext,
    },

    activeTabButtonText: {
      color: COLORS.black,
    },
  });
