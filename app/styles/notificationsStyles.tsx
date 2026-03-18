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
    padding: 18,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 1.5,
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
    color: "#1F1F1F",
    marginRight: 10,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF3F9",
  },

  closeButtonText: {
    fontSize: 22,
    lineHeight: 24,
    color: "#276389",
    fontFamily: "Lexend_400Regular",
  },

  modalBuilding: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#276389",
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
    color: "#5A6B80",
  },

  modalSectionTitle: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#1F1F1F",
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Lexend_400Regular",
    color: "#3E4B57",
  },
});
