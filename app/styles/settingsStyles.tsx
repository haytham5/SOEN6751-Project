import { StyleSheet } from "react-native";
import { Themes } from "./Themes";

const theme = Themes.light;

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.background,
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
    fontFamily: "Lexend_400Regular",
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
    color: theme.logout,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.surface,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  activeTabButton: {
    backgroundColor: theme.background,
  },

  tabButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#6D86A0",
  },

  activeTabButtonText: {
    color: "#223A5E",
  },

  profileCard: {
    backgroundColor: theme.background,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 2,
  },

  profileName: {
    fontFamily: "Lexend_400Regular",
    fontSize: 22,
    color: "#223A5E",
    marginBottom: 20,
  },

  profileRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.surface,
  },

  profileLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#7A90A8",
    marginBottom: 4,
  },

  profileValue: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: theme.primary,
  },
  floatingEditButton: {
    position: "absolute",
    right: 24,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  profileInput: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: "#D7E3F1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#223A5E",
  },

  floatingEditButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: theme.textOnPrimary,
  },
  profileReadOnlyBox: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: "#D7E3F1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },

  profileReadOnlyText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#6D86A0",
  },
});
