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

  subscriptions: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 30,
  },

  // subCard: {
  //   width: 95,
  //   height: 95,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginRight: 10,
  //
  //   borderRadius: 8,
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: "#000",
  //       shadowOffset: { width: 0, height: 1 },
  //       shadowOpacity: 0.8,
  //       shadowRadius: 1,
  //     },
  //     android: {
  //       elevation: 1,
  //       shadowColor: "#000",
  //     },
  //   }),
  // },
  //
  // subCardActive: {
  //   borderWidth: 2,
  //   borderColor: "#276389",
  //   transform: [{ scale: 1.02 }],
  //   margin: 2,
  // },
  //
  // subCardInactive: {
  //   opacity: 0.7,
  //   marginTop: 2,
  // },

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

  subCardActive: {
    borderWidth: 2,
    borderColor: "#276389",
    transform: [{ scale: 1.02 }],
  },

  subCardInactive: {
    opacity: 0.7,
  },

  subBody: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lexend_400Regular",
    color: "white",
  },

  subLabel: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: "Lexend_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
  },

  sectionDescription: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
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
    backgroundColor: "#EEF3F9",
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
    backgroundColor: "#276389",
  },

  toggleLabel: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: "#276389",
  },

  toggleLabelActive: {
    color: "#FFFFFF",
  },

  red: {
    backgroundColor: "#E98A8A",
  },

  green: {
    backgroundColor: "#84D9A1",
  },

  unsubbed: {
    backgroundColor: "#9c9c9c",
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

  notificationCard: {
    padding: 16, 
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 1.5,
    borderLeftWidth: 5,
    backgroundColor: "#F5F8F4",
  },

  notificationRed: {
    borderColor: "#E98A8A",
  },

  notificationGreen: {
    borderColor: "#9FD8AE",
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
    color: "#1F1F1F",
  },

  notificationDescription: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: "#3E4B57",
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
    color: "#2F2F2F",
  },

  badge: {
    backgroundColor: "#16A34A",
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
    backgroundColor: "#D9534F",
  },

  badgeGreen: {
    backgroundColor: "#1FA64A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
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

  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  closeButtonText: {
    fontSize: 28,
    color: "#276389",
    lineHeight: 28,
  },

  modalBuilding: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#444",
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
    color: "#888",
    fontStyle: "italic",
    marginBottom: 12,
  },

  modalSectionTitle: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#1F1F1F",
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: "#333",
  },

  //Card styles
  updateCardInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  updateCardLeft: { flex: 1, paddingRight: 10 },
  updateCardActions: { alignItems: "center", justifyContent: "space-around", gap: 12 },
  updateEventTitle: { flex: 1, fontSize: 17, fontFamily: "Lexend_400Regular", color: "#1F1F1F" },
  updateMeta: { fontSize: 13, fontFamily: "Lexend_400Regular", color: "#5A6B80" },
  updateTypeRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, marginBottom: 4 },
  updateTypeLabel: { fontSize: 13, fontFamily: "Lexend_400Regular", color: "#276389", textTransform: "capitalize" },
  updateReporterRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  verifiedText: { fontSize: 12, fontFamily: "Lexend_400Regular", color: "#1FA64A" },
  actionButton: { alignItems: "center", justifyContent: "center", padding: 6, borderRadius: 8, borderWidth: 1, borderColor: "#276389", minWidth: 44 },
  actionButtonDisabled: { borderColor: "#DDE3EA", backgroundColor: "#F8FAFD" },
  actionCount: { fontSize: 12, fontFamily: "Lexend_400Regular", color: "#276389", marginTop: 2 },
  actionCountDisabled: { color: "#aaa" },
  resolvedMeta: { fontSize: 12, fontFamily: "Lexend_400Regular", color: "#1FA64A", fontStyle: "italic", marginBottom: 2 },
  chevronButton: { alignItems: "center", paddingTop: 4, paddingBottom: 0 },
  modalImage: { width: "100%", height: 180, borderRadius: 10, marginBottom: 12 },
  timelineRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  timelineDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#276389", marginTop: 5 },
  timelineText: { flex: 1, fontSize: 13, fontFamily: "Lexend_400Regular", color: "#3E4B57" },
  timelineTime: { color: "#5A6B80", fontStyle: "italic" },
});
