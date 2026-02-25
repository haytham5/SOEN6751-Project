import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  marker: {
    backgroundColor: "#276389",
    padding: 2,
    borderRadius: 20,
    elevation: 5,
  },

  addReport: {
    position: "absolute",
    bottom: 75,
    left: 15,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  relaxMode: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  reportFilters: {
    position: "absolute",
    bottom: 15,
    left: 15,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  title: {
    fontSize: 28,
    fontFamily: "Pacifico_400Regular",
  },

  body: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },

  userCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#276389",
    justifyContent: "center",
    alignItems: "center",
  },

  mapWrapper: {
    flex: 1,
    margin: 20,
    overflow: "hidden",
    backgroundColor: "#ddd",
    borderRadius: 20,
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

  map: {
    width: "100%",
    height: "100%",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    // backgroundColor: "#F7F9FF",
    borderTopWidth: 1,
    borderTopColor: "#DDE3EA",
  },

  navItem: {
    alignItems: "center",
  },
});
