// import { Platform, StyleSheet } from "react-native";
//
// export const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "space-between",
//   },
//
//   hiddenMarkerContainer: {
//     position: "absolute",
//     top: -9999,
//     left: -9999,
//   },
//
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//
//   title: {
//     fontSize: 25,
//     fontFamily: "Lexend_400Regular",
//   },
//
//   userCircle: {
//     width: 45,
//     height: 45,
//     borderRadius: 25,
//     backgroundColor: "#276389",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//
//   marker: {
//     backgroundColor: "#276389",
//     padding: 20,
//     borderRadius: 20,
//     elevation: 5,
//   },
//
//   mapPreviewWrapper: {
//     height: 250,
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 10,
//     overflow: "hidden",
//     backgroundColor: "#ddd",
//     borderRadius: 20,
//     position: "relative",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.15,
//         shadowRadius: 6,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//
//   mapPreviewOverlay: {
//     position: "absolute",
//     top: 12,
//     alignSelf: "center",
//     backgroundColor: "rgba(255,255,255,0.9)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//
//   mapPreviewText: {
//     fontSize: 12,
//     color: "#276389",
//     fontWeight: "600",
//   },
//
//   addReport: {
//     position: "absolute",
//     bottom: 75,
//     left: 15,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   reportFilters: {
//     position: "absolute",
//     bottom: 15,
//     left: 15,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   relaxMode: {
//     position: "absolute",
//     bottom: 15,
//     right: 15,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   fullScreenContainer: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//
//   closeButton: {
//     position: "absolute",
//     top: 60,
//     right: 20,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 22,
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   fullScreenAddReport: {
//     position: "absolute",
//     bottom: 140,
//     left: 15,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   fullScreenReportFilters: {
//     position: "absolute",
//     bottom: 80,
//     left: 15,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   fullScreenRelaxMode: {
//     position: "absolute",
//     bottom: 80,
//     right: 15,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: "#DDE3EA",
//   },
//
//   navItem: {
//     alignItems: "center",
//   },
// });

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


});