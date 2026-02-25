import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },

  scrollableContent: {
    paddingVertical: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    fontSize: 28,
    fontFamily: "Pacifico_400Regular",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 0,
  },

  label: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },

  logout: {
    paddingHorizontal: 20,
    marginTop: 24,
  },

  logoutLabel: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lexend_400Regular",
    color: "#f16c6c",
  },
});
