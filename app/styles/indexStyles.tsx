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
//   cardBg: "#FFFFFF",
//   tealTint: "#EEF9F8",
//   pinkTint: "#FCEAF1",
//   lavenderTint: "#F3F1FA",
//   softPinkTint: "#F8F1F5",

//   success: "#2E9B63",
//   warning: "#D98B1F",
//   disabled: "#B8BDC7",
// };

export const styles = (COLORS: ThemeType) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: COLORS.white,
    },

    hiddenMarkerContainer: {
      position: "absolute",
      top: -9999,
      left: -9999,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 16,
    },

    title: {
      fontSize: 28,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      letterSpacing: -0.4,
    },

    body: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      lineHeight: 20,
    },

    userCircle: {
      width: 45,
      height: 45,
      borderRadius: 999,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
    },

    mapPreviewWrapper: {
      height: 255,
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

    map: {
      width: "100%",
      height: "100%",
    },

    mapPreviewOverlay: {
      position: "absolute",
      top: 14,
      alignSelf: "center",
      backgroundColor: COLORS.white,
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    mapPreviewText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    marker: {
      backgroundColor: COLORS.primary,
      padding: 20,
      borderRadius: 20,
      elevation: 5,
    },

    addReport: {
      position: "absolute",
      bottom: 18,
      left: 15,
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

    reportFilters: {
      position: "absolute",
      bottom: 18,
      left: 15,
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

    relaxMode: {
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

    fullScreenContainer: {
      flex: 1,
      backgroundColor: COLORS.white,
    },

    closeButton: {
      position: "absolute",
      top: 55,
      right: 16,
      backgroundColor: "rgba(255,255,255,0.96)",
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    fullScreenAddReport: {
      position: "absolute",
      bottom: 80,
      left: 15,
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

    fullScreenReportFilters: {
      position: "absolute",
      bottom: 80,
      left: 15,
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

    fullScreenRelaxMode: {
      position: "absolute",
      bottom: 80,
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

    bottomNav: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      backgroundColor: COLORS.white,
    },

    navItem: {
      alignItems: "center",
    },

    updatesSection: {
      marginBottom: 16,
    },

    updatesHeader: {
      marginBottom: 12,
    },

    updatesTitle: {
      fontSize: 23,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      marginBottom: 4,
      letterSpacing: -0.3,
      marginTop: -2,
    },

    updatesSubtitle: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      lineHeight: 20,
    },

    updateCard: {
      padding: 16,
      marginBottom: 12,
      paddingBottom: 0,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderLeftWidth: 5,
      backgroundColor: COLORS.cardBg,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
        },
        android: {
          elevation: 1,
        },
      }),
    },

    updateTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 8,
    },

    updateEventTitle: {
      flex: 1,
      fontSize: 17,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    updateBuilding: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      marginBottom: 6,
    },

    updateMeta: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.muted,
    },

    updateBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
    },

    updateBadgeRed: {
      backgroundColor: COLORS.pink,
    },

    updateBadgeGreen: {
      backgroundColor: COLORS.success,
    },

    updateBadgeText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.white,
    },

    emptyUpdatesState: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: COLORS.softBg,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    emptyUpdatesTitle: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      marginBottom: 4,
    },

    emptyUpdatesBody: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      textAlign: "center",
    },

    sectionDescription: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      marginBottom: 10,
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
      padding: 18,
      marginBottom: 15,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: COLORS.cardBg,
      borderColor: COLORS.border,
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

    notificationMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 10,
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
      backgroundColor: "rgba(17, 17, 17, 0.35)",
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
        },
      }),
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    modalTitle: {
      fontSize: 20,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      flex: 1,
    },

    modalRow: {
      backgroundColor: COLORS.softBg,
      borderRadius: 14,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    modalRowText: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    modalRowMeta: {
      fontSize: 12,
      color: COLORS.muted,
      marginTop: 3,
    },

    modalSecurityCount: {
      fontSize: 13,
      color: COLORS.primaryDark,
      fontWeight: "600",
      marginTop: 10,
    },

    modalEmptyText: {
      fontSize: 13,
      color: COLORS.muted,
      fontStyle: "italic",
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
      marginBottom: 12,
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

    closeButtonText: {
      fontSize: 28,
      color: COLORS.primaryDark,
      lineHeight: 28,
    },

    demoContainer: {
      backgroundColor: COLORS.black,
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: "#2E2E2E",
    },

    demoLabel: {
      color: "#C9C9C9",
      fontSize: 11,
      marginBottom: 6,
      fontFamily: "Lexend_400Regular",
    },

    demoButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      marginRight: 8,
    },

    demoButtonText: {
      color: COLORS.white,
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
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

    updateTypeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 5,
      marginBottom: 5,
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

    actionButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 7,
      width: 59,
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

    actionCount: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
      marginTop: 2,
    },

    actionCountDisabled: {
      color: COLORS.disabled,
    },

    chevronButton: {
      alignItems: "center",
      paddingTop: 6,
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

    accordionSection: {
      marginBottom: 10,
    },

    accordionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: COLORS.white,
      borderRadius: 18,
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderLeftWidth: 5,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
        },
        android: {
          elevation: 1,
        },
      }),
    },

    accordionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    accordionLabel: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    accordionBadge: {
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: COLORS.primary,
    },

    accordionBadgeText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.white,
    },

    accordionContent: {
      marginTop: 8,
      gap: 0,
    },

    accordionEmptyText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.muted,
      fontStyle: "italic",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },

    resolvedMeta: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.success,
      fontStyle: "italic",
      marginBottom: 2,
    },

    severeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: "#FFF6E8",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
    },

    severeBadgeText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.warning,
      fontWeight: "bold",
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

    markSevereButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 6,
    },

    markSevereText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: COLORS.pink,
      textDecorationLine: "underline",
    },

    reportModeToggle: {
      flexDirection: "row",
      marginTop: 14,
      gap: 10,
    },

    reportModeButton: {
      paddingVertical: 9,
      paddingHorizontal: 15,
      borderRadius: 999,
      backgroundColor: COLORS.softBg,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    reportModeButtonActive: {
      backgroundColor: COLORS.pink,
      borderColor: COLORS.pink,
    },

    reportModeButtonDisabled: {
      opacity: 0.55,
    },

    reportModeButtonText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    reportModeButtonTextActive: {
      color: COLORS.white,
    },

    reportModeButtonTextDisabled: {
      color: COLORS.black,
    },

    expandCircle: {
      position: "absolute",
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: COLORS.white,
      zIndex: 999,
    },

    updateMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 2,
    },

    actionButtonUpvoted: {
      backgroundColor: COLORS.white,
      borderColor: COLORS.primary,
    },

    securityActionsRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
      flexWrap: "wrap",
    },

    securityActionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
    },

    securityActionButtonActive: {
      backgroundColor: "#1FA64A",
      borderColor: "#1FA64A",
    },

    securitySevereButtonActive: {
      backgroundColor: "#F59E0B",
      borderColor: "#F59E0B",
    },

    securityActionText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: "#276389",
    },

    securityActionTextActive: {
      color: COLORS.white,
    },

    actionHelper: {
      fontSize: 10,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
      marginTop: 2,
    },

    actionHelperDisabled: {
      color: COLORS.disabled,
    },
  });
