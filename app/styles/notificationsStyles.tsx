import { Platform, StyleSheet } from "react-native";
import { Themes } from "./Themes";

const theme = Themes.light;

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.background,
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
  },

  body: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },

  subscriptions: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 30,
  },

  subCard: {
    width: 95,
    height: 95,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,

    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
        shadowColor: "#000",
      },
    }),
  },

  subCardActive: {
    borderWidth: 2,
    borderColor: theme.primary,
    transform: [{ scale: 1.02 }],
    margin: 2,
  },

  subCardInactive: {
    opacity: 0.7,
    marginTop: 2,
  },

  subBody: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Lexend_400Regular",
    color: "white",
  },

  subLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: theme.background,
    opacity: 0.9,
  },

  sectionDescription: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: theme.textSecondary,
    marginBottom: 10,
  },

  notification: {
    padding: 16,
    marginBottom: 15,
    borderRadius: 8,
  },

  notificationBody: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },

  bold: {
    fontWeight: "700",
  },

  toggleGroup: {
    flexDirection: "row",
    backgroundColor: theme.surfaceSoft,
    borderRadius: 20,
    padding: 2,
    gap: 4,
  },

  toggleOption: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },

  toggleOptionActive: {
    backgroundColor: theme.primary,
  },

  toggleLabel: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: theme.primary,
  },

  toggleLabelActive: {
    color: theme.textOnPrimary,
  },

  red: {
    backgroundColor: theme.lowPriority,
  },

  green: {
    backgroundColor: theme.fbBuilding,
  },

  unsubbed: {
    backgroundColor: theme.unsubbed,
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
    borderColor: theme.lowPriority,
  },

  notificationGreen: {
    borderColor: theme.fbBuilding,
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

  notificationDescription: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: theme.textTertiary,
    marginBottom: 14,
    lineHeight: 22,
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
    backgroundColor: theme.lowPriorityBadge,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: theme.textOnPrimary,
  },

  badgeRed: {
    backgroundColor: theme.highPriority,
  },

  badgeGreen: {
    backgroundColor: theme.lowPriorityBadge,
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
    flex: 1,
    fontSize: 22,
    fontFamily: "Lexend_400Regular",
    color: theme.textPrimary,
    marginRight: 10,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.surface,
  },

  closeButtonText: {
    fontSize: 22,
    lineHeight: 24,
    color: theme.primary,
    fontFamily: "Lexend_400Regular",
  },

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
});
