import { Platform, StyleSheet } from "react-native";

import { ThemeType } from "../data/themeProvider";

// const COLORS = {
//   white: "#FFFFFF",
//   black: "#111111",
//   text: "#1F1F1F",
//   subtext: "#4E4E4E",
//   muted: "#6B7280",

//   primary: "#56bab8",
//   primaryDark: "#5a8c8b",
//   pink: "#e7548b",
//   lavender: "#9796b8",
//   softPink: "#d6b1c3",

//   border: "#E7E7EC",
//   softBg: "#F9FAFB",
//   tealTint: "#EEF9F8",
//   pinkTint: "#FCEAF1",
//   lavenderTint: "#F3F1FA",
// };

export const styles = (COLORS: ThemeType) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: COLORS.white,
    },

    scrollableContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    scrollableContentHorizontal: {
      padding: 0,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 0,
      paddingVertical: 10,
    },

    title: {
      fontSize: 25,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    body: {
      fontSize: 18,
      fontFamily: "Lexend_400Regular",
      color: COLORS.text,
    },

    subscriptions: {
      flexDirection: "row",
      gap: 0,
      marginBottom: 30,
      paddingStart: 6,
    },

    subCard: {
      width: 68,
      height: 68,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
        android: {
          elevation: 2,
          shadowColor: "#000",
        },
      }),
    },

    subCardActive: {
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      transform: [{ scale: 1.02 }],
      margin: 2,
    },

    subCardInactive: {
      opacity: 0.9,
      marginTop: 2,
    },

    subBody: {
      fontSize: 18,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    subLabel: {
      marginTop: 4,
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
    },

    sectionDescription: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      marginBottom: 10,
    },

    notification: {
      padding: 16,
      marginBottom: 15,
      borderRadius: 8,
    },

    notificationBody: {
      color: COLORS.white,
      fontSize: 18,
      fontFamily: "Lexend_400Regular",
    },

    bold: {
      fontWeight: "700",
    },

    toggleGroup: {
      flexDirection: "row",
      backgroundColor: COLORS.softBg,
      borderRadius: 20,
      padding: 3,
      gap: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    toggleOption: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },

    toggleOptionActive: {
      backgroundColor: COLORS.pink,
    },

    toggleLabel: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
    },

    toggleLabelActive: {
      color: COLORS.white,
    },

    red: {
      backgroundColor: COLORS.pinkTint,
    },

    green: {
      backgroundColor: COLORS.tealTint,
    },

    unsubbed: {
      backgroundColor: COLORS.softBg,
    },

    emptyState: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      alignItems: "center",
    },

    emptyStateTitle: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      marginBottom: 4,
    },

    emptyStateBody: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      textAlign: "center",
    },

    notificationCard: {
      padding: 16,
      marginBottom: 15,
      borderRadius: 22,
      borderWidth: 1,
      borderLeftWidth: 5,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
        },
        android: {
          elevation: 1,
        },
      }),
    },

    notificationRed: {
      borderColor: COLORS.softPink,
    },

    notificationGreen: {
      borderColor: COLORS.primary,
    },

    notificationTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      gap: 12,
    },

    notificationTitle: {
      flex: 1,
      fontSize: 20,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    notificationDescription: {
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      marginBottom: 14,
      lineHeight: 22,
    },

    notificationMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 10,
      flexWrap: "wrap",
    },

    notificationMeta: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.text,
    },

    badge: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    badgeText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.white,
    },

    badgeRed: {
      backgroundColor: COLORS.pink,
    },

    badgeGreen: {
      backgroundColor: COLORS.success,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(17,17,17,0.35)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },

    modalCard: {
      width: "100%",
      backgroundColor: COLORS.white,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
        },
        android: {
          elevation: 6,
          shadowColor: "#000",
        },
      }),
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },

    modalTitle: {
      fontSize: 20,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      flex: 1,
    },

    closeButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },

    closeButtonText: {
      fontSize: 28,
      color: COLORS.primaryDark,
      lineHeight: 28,
    },

    modalBuilding: {
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
    },

    modalBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 18,
    },

    modalTime: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.muted,
      fontStyle: "italic",
    },

    modalSectionTitle: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      marginBottom: 8,
    },

    modalDescription: {
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
      color: COLORS.text,
      lineHeight: 22,
      marginBottom: 10,
    },

    severeIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
      marginBottom: 5,
      backgroundColor: "#FFF6E8",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },

    severeIndicatorText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.warning,
      fontWeight: "bold",
    },

    updateCardInner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    updateCardLeft: {
      flex: 1,
      paddingRight: 10,
    },

    updateCardActions: {
      alignItems: "center",
      justifyContent: "space-around",
      gap: 12,
    },

    updateEventTitle: {
      flex: 1,
      fontSize: 17,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    updateMeta: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
    },

    updateTypeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 4,
      marginBottom: 4,
    },

    updateTypeLabel: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
      textTransform: "capitalize",
    },

    updateReporterRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
    },

    verifiedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: "#EEF9F2",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
    },

    verifiedText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.success,
    },

    // actionButton: {
    //   alignItems: "center",
    //   justifyContent: "center",
    //   padding: 7,
    //   borderRadius: 12,
    //   borderWidth: 1,
    //   borderColor: COLORS.primary,
    //   minWidth: 46,
    //   backgroundColor: COLORS.tealTint,
    // },
    //
    // actionButtonDisabled: {
    //   borderColor: COLORS.border,
    //   backgroundColor: COLORS.softBg,
    // },
    actionButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 7,
      width: 55,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.primary,
      minWidth: 46,
      backgroundColor: COLORS.tealTint,
    },

    actionButtonDisabled: {
      borderColor: COLORS.border,
      backgroundColor: COLORS.softBg,
    },

    // actionCount: {
    //   fontSize: 12,
    //   fontFamily: "Lexend_400Regular",
    //   color: COLORS.primaryDark,
    //   marginTop: 2,
    // },
    actionCount: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
      marginTop: 2,
    },
    actionCountDisabled: {
      color: COLORS.disabled,
    },

    resolvedMeta: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.success,
      fontStyle: "italic",
      marginBottom: 2,
    },

    chevronButton: {
      alignItems: "center",
      paddingTop: 4,
      paddingBottom: 0,
    },

    modalImage: {
      width: "100%",
      height: 180,
      borderRadius: 14,
      marginBottom: 12,
    },

    timelineRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 8,
    },

    timelineDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: COLORS.pink,
      marginTop: 5,
    },

    timelineText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
    },

    timelineTime: {
      color: COLORS.muted,
      fontStyle: "italic",
    },

    actionButtonUpvoted: {
      backgroundColor: "#E8F0F7",
      borderColor: "#276389",
    },

    updateMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 2,
    },

    actionHelper: {
      fontSize: 10,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
      marginTop: 2,
    },

    actionHelperDisabled: {
      color: COLORS.disabled,
    },filterChip: {
          minWidth: 74,
          height: 48,
          paddingHorizontal: 16,
          marginRight: 10,
          borderRadius: 16,
          borderWidth: 1.5,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: COLORS.white,
          ...Platform.select({
              ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
              },
              android: {
                  elevation: 2,
                  shadowColor: "#000",
              },
          }),
      },

      filterChipActive: {
          transform: [{ scale: 1.03 }],
      },

      filterChipText: {
          fontSize: 16,
          fontFamily: "Lexend_400Regular",
      },

      filterChipTextActive: {
          fontWeight: "700",
      },

      filterChipBadge: {
          position: "absolute",
          top: -1,   // was -6
          right: -1, // was -6
          width: 20,
          height: 20,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: COLORS.white,
      },
      filterChipBadgeText: {
          color: COLORS.white,
          fontSize: 11,
          fontFamily: "Lexend_400Regular",
      },
  });
