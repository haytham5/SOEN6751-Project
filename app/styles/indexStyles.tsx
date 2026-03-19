import { Platform, StyleSheet } from "react-native";
import { Themes } from "./Themes";

const theme = Themes.dark;

export const styles = StyleSheet.create({
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
    width: "70%",
    fontFamily: "Lexend_400Regular",
    color: theme.textPrimary,
  },

  body: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: theme.textSecondary,
  },

  userCircle: {
    width: 45,
    height: 45,
    borderRadius: 999,
    backgroundColor: theme.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  mapPreviewWrapper: {
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: theme.surface,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "#DDE3EA",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderColor: "#DDE3EA",
  },

  mapPreviewText: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: "#276389",
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
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    backgroundColor: "#FFFFFF",
  },

  closeButton: {
    position: "absolute",
    top: 58,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  fullScreenAddReport: {
    position: "absolute",
    bottom: 140,
    left: 15,
    backgroundColor: theme.background,
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderTopColor: theme.border,
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
    color: theme.textPrimary,
    marginBottom: 2,
  },

  updatesSubtitle: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: theme.textSecondary,
  },

  updateCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: theme.surface,
  },

  updateCardRed: {
    borderColor: theme.highPriority,
  },

  updateCardGreen: {
    borderColor: theme.lowPriority,
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
    color: theme.textPrimary,
  },

  updateBuilding: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: theme.textTertiary,
    marginBottom: 6,
  },

  updateMeta: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: theme.textSecondary,
  },

  updateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  updateBadgeRed: {
    backgroundColor: theme.highPriorityBadge,
  },

  updateBadgeGreen: {
    backgroundColor: theme.lowPriorityBadge,
  },

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
    backgroundColor: theme.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.textSecondary,
    textAlign: "center",
  },

  sectionDescription: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: theme.textSecondary,
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
    color: theme.textSecondary,
    textAlign: "center",
  },

  notificationCard: {
    padding: 18,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: theme.surface,
  },

  notificationRed: {
    borderColor: theme.highPriority,
  },

  notificationGreen: {
    borderColor: theme.lowPriority,
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
    color: theme.textPrimary,
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
    color: theme.textPrimaryMeta,
  },

  badge: {
    backgroundColor: theme.successAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#FFFFFF",
  },

  badgeRed: {
    backgroundColor: theme.highPriority,
  },

  badgeGreen: {
    backgroundColor: theme.lowPriority,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "flex-start",
    marginBottom: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Pacifico_400Regular",
    color: theme.primary,
    flex: 1,
  },

  modalRow: {
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },

  modalRowText: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#333",
  },

  modalRowMeta: {
    fontSize: 11,
    color: theme.textMuted,
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
    color: theme.textLight,
    fontStyle: "italic",
  },

  // modalTitle: {
  //   flex: 1,
  //   fontSize: 22,
  //   fontFamily: "Lexend_400Regular",
  //   color: "#1F1F1F",
  //   marginRight: 10,
  // },

  modalBuilding: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: theme.primary,
    marginBottom: 12,
  },

  modalBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },

  modalTime: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: theme.textSecondary,
  },

  modalSectionTitle: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: theme.textPrimary,
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Lexend_400Regular",
    color: theme.textTertiary,
  },

  closeButtonText: {
    fontSize: 22,
    lineHeight: 24,
    color: theme.primary,
    fontFamily: "Lexend_400Regular",
  },
});
