import { Platform, StyleSheet } from "react-native";
import { ThemeType } from "../data/themeProvider";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.background,
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
      paddingBottom: 14,
    },

    title: {
      fontSize: 25,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface,
    },

    body: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.onPrimaryContainer,
    },

    // userCircle: {
    //   width: 45,
    //   height: 45,
    //   borderRadius: 999,
    //   backgroundColor: theme.primary,
    //   justifyContent: "center",
    //   alignItems: "center",
    // },

    mapPreviewWrapper: {
      height: 250,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.surface,
      marginBottom: 18,
      borderWidth: 1.5,
      borderColor: theme.outline,
      position: "relative",
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        android: {
          elevation: 2,
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
      backgroundColor: theme.background,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderWidth: 1,
      borderColor: theme.outline,
    },

    mapPreviewText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: theme.primary,
    },

    marker: {
      backgroundColor: theme.primary,
      padding: 20,
      borderRadius: 20,
      elevation: 5,
    },

    addReport: {
      position: "absolute",
      bottom: 78,
      left: 15,
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.outline,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
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
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.outline,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
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
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.outline,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    fullScreenContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },

    closeButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },

    fullScreenAddReport: {
      position: "absolute",
      bottom: 140,
      left: 15,
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.outline,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
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
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.outline,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
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
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.outline,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
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
      borderTopColor: theme.outline,
      backgroundColor: theme.background,
    },

    navItem: {
      alignItems: "center",
    },

    updatesSection: {
      marginBottom: 16,
    },

    updatesHeader: {
      marginBottom: 10,
    },

    updatesTitle: {
      fontSize: 22,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface,
      marginBottom: 2,
    },

    updatesSubtitle: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.onPrimaryContainer,
    },

    updateCard: {
      padding: 16,
      marginBottom: 12,
      paddingBottom: 0,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.outline, // grey all around
      borderLeftWidth: 5, // thicker left edge
      backgroundColor: theme.surface,
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
      color: theme.onSurface,
    },

    updateBuilding: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.secondary,
      marginBottom: 6,
    },

    updateMeta: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: theme.onPrimaryContainer,
    },

    updateBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
    },

    // updateBadgeRed: {
    //   backgroundColor: "#D9534F",
    // },

    // updateBadgeGreen: {
    //   backgroundColor: "#1FA64A",
    // },

    updateBadgeText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: theme.background,
    },

    emptyUpdatesState: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.outline,
    },

    emptyUpdatesTitle: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: theme.primary,
      marginBottom: 4,
    },

    emptyUpdatesBody: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.onPrimaryContainer,
      textAlign: "center",
    },

    sectionDescription: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.onPrimaryContainer,
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
      fontWeight: "600",
      color: theme.primary,
      marginBottom: 4,
    },

    emptyStateBody: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.onPrimaryContainer,
      textAlign: "center",
    },

    notificationCard: {
      padding: 18,
      marginBottom: 15,
      borderRadius: 20,
      borderWidth: 1.5,
      backgroundColor: theme.surface,
    },

    // notificationRed: {
    //   borderColor: "#E98A8A",
    // },

    // notificationGreen: {
    //   borderColor: "#9FD8AE",
    // },

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
      color: theme.onSurface,
    },

    notificationMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 10,
    },

    // notificationMeta: {
    //   fontSize: 14,
    //   fontFamily: "Lexend_400Regular",
    //   color: "#2F2F2F",
    // },

    // badge: {
    //   backgroundColor: "#16A34A",
    //   paddingHorizontal: 12,
    //   paddingVertical: 6,
    //   borderRadius: 999,
    // },

    badgeText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: theme.background,
    },

    // badgeRed: {
    //   backgroundColor: "#D9534F",
    // },

    // badgeGreen: {
    //   backgroundColor: "#1FA64A",
    // },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },

    modalCard: {
      width: "100%",
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
          shadowColor: theme.shadow,
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
      color: theme.primary,
      flex: 1,
    },

    modalRow: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 10,
      marginBottom: 6,
    },

    modalRowText: {
      fontSize: 14,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface70,
    },

    modalRowMeta: {
      fontSize: 11,
      color: theme.onSurface50,
      fontStyle: "italic",
      marginTop: 2,
    },

    modalSecurityCount: {
      fontSize: 13,
      color: theme.primary,
      fontWeight: "600",
      marginTop: 10,
    },

    modalEmptyText: {
      fontSize: 13,
      color: theme.onSurface30,
      fontStyle: "italic",
    },

    modalBuilding: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface50,
      marginBottom: 6,
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
      color: theme.onSurface50,
      fontStyle: "italic",
      marginBottom: 12,
    },

    modalSectionTitle: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface,
      marginBottom: 8,
    },

    modalDescription: {
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface70,
    },

    closeButtonText: {
      fontSize: 28,
      color: theme.primary,
      lineHeight: 28,
    },

    demoContainer: {
      backgroundColor: theme.onBackground,
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    demoLabel: {
      color: theme.onSurface30,
      fontSize: 11,
      marginBottom: 6,
      fontFamily: "Lexend_400Regular",
    },
    demoButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
    },
    demoButtonText: {
      color: "white",
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
      marginTop: 4,
      marginBottom: 4,
    },
    updateTypeLabel: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: theme.primary,
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
    },
    verifiedText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: "#1FA64A",
    },
    actionButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.primary,
      minWidth: 44,
    },
    actionButtonDisabled: {
      borderColor: theme.outline,
      backgroundColor: theme.surface,
    },
    actionCount: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: theme.primary,
      marginTop: 2,
    },
    actionCountDisabled: {
      color: theme.onSurface30,
    },

    chevronButton: {
      alignItems: "center",
      paddingTop: 5,
    },

    modalImage: {
      width: "100%",
      height: 180,
      borderRadius: 10,
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
      backgroundColor: theme.primary,
      marginTop: 5,
    },
    timelineText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: theme.secondary,
    },
    timelineTime: {
      color: theme.onPrimaryContainer,
      fontStyle: "italic",
    },

    accordionSection: {
      marginBottom: 8,
    },

    accordionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderLeftWidth: 5,
      borderWidth: 1,
      borderColor: theme.outline,
    },
    accordionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    accordionLabel: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface,
    },
    accordionBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: theme.primary,
    },
    accordionBadgeText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: theme.background,
    },
    accordionContent: {
      marginTop: 6,
      gap: 0,
    },
    accordionEmptyText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: theme.onSurface30,
      fontStyle: "italic",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },

    resolvedMeta: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: "#1FA64A",
      fontStyle: "italic",
      marginBottom: 2,
    },

    severeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    severeBadgeText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: "#F59E0B",
      fontWeight: "bold",
    },

    severeIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
      marginBottom: 4,
    },
    severeIndicatorText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: "#F59E0B",
      fontWeight: "bold",
    },

    markSevereButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    markSevereText: {
      fontSize: 12,
      fontFamily: "Lexend_400Regular",
      color: "#F59E0B",
      textDecorationLine: "underline",
    },

    reportModeToggle: {
      flexDirection: "row",
      marginTop: 12,
      gap: 10,
    },

    reportModeButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.outline,
    },

    reportModeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    reportModeButtonDisabled: {
      opacity: 0.55,
    },

    reportModeButtonText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: theme.primary,
    },

    reportModeButtonTextActive: {
      color: theme.background,
    },

    reportModeButtonTextDisabled: {
      color: theme.primary,
    },
  });
