import { Platform, StyleSheet } from "react-native";

const COLORS = {
  white: "#FFFFFF",
  black: "#111111",
  text: "#1F1F1F",
  subtext: "#4E4E4E",
  muted: "#6B7280",

  primary: "#56bab8",
  primaryDark: "#5a8c8b",
  pink: "#e7548b",
  lavender: "#9796b8",
  softPink: "#d6b1c3",

  border: "#E7E7EC",
  softBg: "#F9FAFB",
  tealTint: "#EEF9F8",
  pinkTint: "#FCEAF1",
  lavenderTint: "#F3F1FA",
};

export const styles = StyleSheet.create({
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

  eventLegends: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 30,
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

  eventCard: {
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 14,
    borderRadius: 10,
  },

  eventText: {
    color: COLORS.white,
    fontWeight: "700",
    fontFamily: "Lexend_400Regular",
  },

  subBody: {
    fontSize: 22,
    fontFamily: "Lexend_400Regular",
    color: COLORS.black,
  },

  eventLegend: {
    padding: 16,
    marginBottom: 15,
    borderRadius: 8,
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

  red: {
    backgroundColor: COLORS.pinkTint,
  },

  green: {
    backgroundColor: COLORS.tealTint,
  },

  unsubbed: {
    backgroundColor: COLORS.softBg,
    opacity: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 17, 17, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    width: "100%",
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

  modalBuilding: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: COLORS.subtext,
  },

  modalTime: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: COLORS.muted,
    fontStyle: "italic",
  },

  modalDescription: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: COLORS.text,
    lineHeight: 22,
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

  notificationCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 5,
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

  notificationCardRed: {
    backgroundColor: COLORS.pinkTint,
  },

  notificationCardGreen: {
    backgroundColor: COLORS.tealTint,
  },

  notificationTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: COLORS.black,
    marginRight: 10,
  },

  notificationBuilding: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: COLORS.subtext,
  },

  notificationMeta: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: COLORS.muted,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  badgeRed: {
    backgroundColor: COLORS.softPink,
  },

  badgeGreen: {
    backgroundColor: COLORS.tealTint,
  },

  badgeText: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: COLORS.black,
  },

  notificationRed: {
    borderColor: COLORS.softPink,
  },

  notificationGreen: {
    borderColor: COLORS.primary,
  },

  notificationMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
    flexWrap: "wrap",
  },

  modalSectionTitle: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: COLORS.black,
    marginBottom: 8,
  },

  modalBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },

  subscriptions: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 26,
  },

  subCardActive: {
    transform: [{ scale: 1.02 }],
    margin: 2,
  },

  subCardInactive: {
    opacity: 0.9,
    marginTop: 2,
  },

  subLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: COLORS.subtext,
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

  calendarCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 10,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  calendar: {
    borderRadius: 16,
  },

  sectionDescription: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: COLORS.subtext,
    marginBottom: 10,
  },

  adminButton: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  adminButtonText: {
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

  updateEventTitle: {
    fontSize: 17,
    fontFamily: "Lexend_400Regular",
    color: COLORS.black,
    marginBottom: 2,
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

  chevronButton: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 0,
  },

  updateMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
});