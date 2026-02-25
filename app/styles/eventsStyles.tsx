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
    fontSize: 28,
    fontFamily: "Pacifico_400Regular",
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
});
