import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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

  eventLegends: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 30,
  },

  subCard: {
    width: 65,
    height: 65,
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

  eventCard: {
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 14,
    borderRadius: 10,
  },

  eventText: {
    color: "white",
    fontWeight: "700",
  },

  subBody: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Lexend_400Regular",
    color: "white",
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
    color: "white",
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },

  bold: {
    fontWeight: "700",
  },

  red: {
    backgroundColor: "#E98A8A",
  },

  green: {
    backgroundColor: "#84D9A1",
  },

  unsubbed: {
    backgroundColor: "#9c9c9c",
    opacity: 0.7,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
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
    color: "#276389",
    flex: 1,
  },
  modalBuilding: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#444",
    marginBottom: 6,
  },
  modalTime: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#888",
    fontStyle: "italic",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: "#333",
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeButtonText: {
    fontSize: 28,
    color: "#276389",
    lineHeight: 28,
  },

  notificationCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderLeftWidth: 5,
    backgroundColor: "#F5F8F4",
  },

  notificationCardRed: {
    backgroundColor: "#FBE4E4",
  },

  notificationCardGreen: {
    backgroundColor: "#E6F6EA",
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
    color: "#1B1B1B",
    marginRight: 10,
  },

  notificationBuilding: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#3A3A3A",
  },

  notificationMeta: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: "#6B7280",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  badgeRed: {
    backgroundColor: "#F4B5B5",
  },

  badgeGreen: {
    backgroundColor: "#BFE7C8",
  },

  badgeText: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: "#1B1B1B",
  },

  // notificationCard: {
  //   padding: 18,
  //   marginBottom: 15,
  //   borderRadius: 20,
  //   borderWidth: 1.5,
  //   backgroundColor: "#F5F8F4",
  // },

  notificationRed: {
    borderColor: "#E98A8A",
  },

  notificationGreen: {
    borderColor: "#9FD8AE",
  },

  // notificationTopRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 10,
  //   gap: 12,
  // },
  //
  // notificationTitle: {
  //   flex: 1,
  //   fontSize: 20,
  //   fontFamily: "Lexend_400Regular",
  //   color: "#1F1F1F",
  // },

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
    color: "#1F1F1F",
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
    marginBottom: 30,
  },

  subCardActive: {
    borderWidth: 2,
    borderColor: "#276389",
    transform: [{ scale: 1.02 }],
    margin: 2,
  },

  subCardInactive: {
    opacity: 0.7,
    marginTop: 2,
  },

  subLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
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
    color: "#276389",
    marginBottom: 4,
  },

  emptyStateBody: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
    textAlign: "center",
  },

  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5EAF0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  calendar: {
    borderRadius: 16,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
    marginBottom: 10,
  },

  adminButton: {
  backgroundColor: "#276389",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 8,
  },
  adminButtonText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
  },

  updateCardInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  updateCardLeft: { flex: 1, paddingRight: 10 },
  updateEventTitle: { fontSize: 17, fontFamily: "Lexend_400Regular", color: "#1F1F1F", marginBottom: 2 },
  updateMeta: { fontSize: 13, fontFamily: "Lexend_400Regular", color: "#5A6B80" },
  updateTypeRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, marginBottom: 4 },
  updateTypeLabel: { fontSize: 13, fontFamily: "Lexend_400Regular", color: "#276389", textTransform: "capitalize" },
  chevronButton: { alignItems: "center", paddingTop: 4, paddingBottom: 0 },
});
