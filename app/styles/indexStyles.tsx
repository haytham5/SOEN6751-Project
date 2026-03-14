import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
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
    color: "#1F1F1F",
  },

  body: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
  },

  userCircle: {
    width: 45,
    height: 45,
    borderRadius: 999,
    backgroundColor: "#276389",
    justifyContent: "center",
    alignItems: "center",
  },

  mapPreviewWrapper: {
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F5F8F4",
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#276389",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },

  addReport: {
    position: "absolute",
    bottom: 78,
    left: 15,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDE3EA",
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
    borderTopColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
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
    color: "#1F1F1F",
    marginBottom: 2,
  },

  updatesSubtitle: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
  },

  updateCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: "#F5F8F4",
  },

  updateCardRed: {
    borderColor: "#E98A8A",
  },

  updateCardGreen: {
    borderColor: "#9FD8AE",
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
    color: "#1F1F1F",
  },

  updateBuilding: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#3E4B57",
    marginBottom: 6,
  },

  updateMeta: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
  },

  updateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  updateBadgeRed: {
    backgroundColor: "#D9534F",
  },

  updateBadgeGreen: {
    backgroundColor: "#1FA64A",
  },

  updateBadgeText: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: "#FFFFFF",
  },

  emptyUpdatesState: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#DDE3EA",
  },

  emptyUpdatesTitle: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#276389",
    marginBottom: 4,
  },

  emptyUpdatesBody: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
    textAlign: "center",
  },


  sectionDescription: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
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

  closeButtonText: {
    fontSize: 22,
    lineHeight: 24,
    color: "#276389",
    fontFamily: "Lexend_400Regular",
  },


});