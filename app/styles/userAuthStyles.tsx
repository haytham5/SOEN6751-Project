import { StyleSheet } from "react-native";
import { Themes } from "./Themes";

const theme = Themes.light;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 48,
  },

  logoArea: {
    alignItems: "center",
    marginTop: 80,
  },

  title: {
    fontFamily: "Lexend_400Regular",
    fontSize: 36,
    color: theme.textPrimaryColor,
    marginBottom: 8,
  },

  tagline: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#6B84A3",
  },

  buttonGroup: {
    gap: 12,
  },

  primaryButton: {
    backgroundColor: theme.textPrimaryColor,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  primaryButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: theme.textOnPrimary,
    letterSpacing: 0.4,
  },

  secondaryButton: {
    backgroundColor: theme.textOnPrimary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.textPrimaryColor,
  },

  secondaryButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: theme.textPrimaryColor,
    letterSpacing: 0.4,
  },

  ghostButton: {
    alignItems: "center",
    paddingVertical: 12,
  },

  ghostButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#6B84A3",
    textDecorationLine: "underline",
  },

  background: {
    flex: 1,
    backgroundColor: theme.surfaceSoft,
  },

  inputLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: theme.textPrimaryColor,
    marginBottom: 6,
    marginTop: 4,
  },

  input: {
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: theme.textPrimaryColor,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },

  card: {
    backgroundColor: theme.textOnPrimary,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: theme.textPrimaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },

  cardTitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 22,
    color: theme.textPrimaryColor,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#6B84A3",
    marginBottom: 24,
  },

  passwordRow: {
    position: "relative",
    justifyContent: "center",
    marginBottom: 0,
  },

  passwordInput: {
    marginBottom: 14,
    paddingRight: 72,
  },

  showHideButton: {
    position: "absolute",
    right: 16,
    top: 13,
  },

  showHideText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#4A7FC1",
  },

  appTitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 36,
    color: theme.textPrimaryColor,
    marginBottom: 6,
  },

  errorBox: {
    backgroundColor: "#FFF0F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCCCC",
  },

  errorText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#C0392B",
  },

  keyboardView: {
    flex: 1,
  },

  // scrollableContent: {
  //   flexGrow: 1,
  //   justifyContent: "center",
  //   paddingHorizontal: 24,
  //   paddingTop: 70,
  //   paddingBottom: 24,
  // },
  scrollableContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#6B84A3",
  },

  footerLink: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#4A7FC1",
    fontWeight: "600",
  },

  successBox: {
    backgroundColor: "#F0FFF4",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#C3E6CB",
  },

  successText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#276749",
  },
  topRow: {
    width: "100%",
    marginBottom: 8,
  },

  backLink: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#4D6A85",
  },

  // topBackButton: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   zIndex: 20,
  //   paddingTop: 8,
  //   paddingLeft: 12,
  //   paddingRight: 12,
  //   paddingBottom: 8,
  // },
  topBackButton: {
    position: "absolute",
    left: 12,
    zIndex: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  topBackText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: "#4D6A85",
  },

  guestLinkWrapper: {
    marginTop: 14,
    alignItems: "center",
  },

  guestLink: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#6D86A0",
    textDecorationLine: "underline",
  },

  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  roleButton: {
    flex: 1,
    backgroundColor: "#EEF3FB",
    borderWidth: 1,
    borderColor: "#D7E3F1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  roleButtonActive: {
    backgroundColor: "#1F365C",
    borderColor: "#1F365C",
  },

  roleButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#6D86A0",
  },

  roleButtonTextActive: {
    color: theme.textOnPrimary,
  },
});
