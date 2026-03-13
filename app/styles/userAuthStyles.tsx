import { StyleSheet } from "react-native";

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
    fontFamily: "Pacifico_400Regular",
    fontSize: 36,
    color: "#1A2E4A",
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
    backgroundColor: "#1A2E4A",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  primaryButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A2E4A",
  },

  secondaryButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#1A2E4A",
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
  backgroundColor: "#F7F9FF",
},

inputLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#1A2E4A",
    marginBottom: 6,
    marginTop: 4,
  },

  input: {
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#1A2E4A",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#DDE6F5",
  },


  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#1A2E4A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },

  cardTitle: {
    fontFamily: "Pacifico_400Regular",
    fontSize: 22,
    color: "#1A2E4A",
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
    fontFamily: "Pacifico_400Regular",
    fontSize: 36,
    color: "#1A2E4A",
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

  scrollableContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "center",
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


});