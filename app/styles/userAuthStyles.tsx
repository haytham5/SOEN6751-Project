import { StyleSheet } from "react-native";
import { ThemeType } from "../data/themeProvider";

// const COLORS = {
//   white: "#FFFFFF",
//   black: "#111111",
//   text: "#1F1F1F",
//   subtext: "#4E4E4E",
//   muted: "#6B7280",

//   primary: "#56bab8",
//   primaryDark: "#5a8c8b",
//   pink: "#e7548b",
//   lavender: "#9796b8",
//   softPink: "#d6b1c3",

//   border: "#E7E7EC",
//   softBg: "#F9FAFB",
//   tealTint: "#EEF9F8",
//   pinkTint: "#FCEAF1",
//   lavenderTint: "#F3F1FA",

//   errorBg: "#FFF1F4",
//   errorBorder: "#F3C7D6",
//   errorText: "#B42318",

//   successBg: "#EEF9F8",
//   successBorder: "#BFE8E6",
//   successText: "#2F6F6D",
// };

export const styles = (COLORS: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingBottom: 48,
    },

    logoArea: {
      alignItems: "center",
      marginTop: 80,
      marginBottom: 8,
    },

    title: {
      fontFamily: "Lexend_400Regular",
      fontSize: 25,
      color: COLORS.black,
      marginBottom: 8,
    },

    tagline: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: COLORS.subtext,
    },

    buttonGroup: {
      gap: 12,
    },

    primaryButton: {
      backgroundColor: COLORS.pink,
      borderRadius: 16,
      paddingVertical: 15,
      alignItems: "center",
    },

    primaryButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 15,
      color: COLORS.white,
      letterSpacing: 0.2,
    },

    secondaryButton: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      paddingVertical: 15,
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    secondaryButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 15,
      color: COLORS.primaryDark,
      letterSpacing: 0.2,
    },

    ghostButton: {
      alignItems: "center",
      paddingVertical: 12,
    },

    ghostButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.subtext,
      textDecorationLine: "underline",
    },

    background: {
      flex: 1,
      backgroundColor: COLORS.white,
    },

    inputLabel: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.black,
      marginBottom: 6,
      marginTop: 4,
    },

    input: {
      backgroundColor: COLORS.softBg,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: COLORS.black,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    card: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      paddingHorizontal: 24,
      paddingVertical: 28,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    cardTitle: {
      fontFamily: "Lexend_400Regular",
      fontSize: 22,
      color: COLORS.black,
      marginBottom: 4,
    },

    cardSubtitle: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.subtext,
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
      color: COLORS.primaryDark,
    },

    appTitle: {
      fontFamily: "Lexend_400Regular",
      fontSize: 36,
      color: COLORS.black,
      marginBottom: 6,
      letterSpacing: -0.5,
    },

    errorBox: {
      backgroundColor: COLORS.errorBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.errorBorder,
    },

    errorText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.errorText,
    },

    keyboardView: {
      flex: 1,
    },

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
      color: COLORS.subtext,
    },

    footerLink: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.primaryDark,
      fontWeight: "600",
    },

    successBox: {
      backgroundColor: COLORS.successBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginTop: 12,
      borderWidth: 1,
      borderColor: COLORS.successBorder,
    },

    successText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: COLORS.successText,
    },

    topRow: {
      width: "100%",
      marginBottom: 8,
    },

    backLink: {
      fontFamily: "Lexend_400Regular",
      fontSize: 15,
      color: COLORS.primaryDark,
    },

    topBackButton: {
      position: "absolute",
      zIndex: 20,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: COLORS.white,
      width: "100%",
      // borderBottomColor: COLORS.border,
      // borderBottomWidth: 2,
    },

    topBackText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 16,
      color: COLORS.primaryDark,
    },

    guestLinkWrapper: {
      marginTop: 14,
      alignItems: "center",
    },

    guestLink: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: COLORS.primaryDark,
      textDecorationLine: "underline",
    },

    roleRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
    },

    roleButton: {
      flex: 1,
      backgroundColor: COLORS.softBg,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },

    roleButtonActive: {
      backgroundColor: COLORS.tealTint,
      borderColor: COLORS.primary,
    },

    roleButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: COLORS.subtext,
    },

    roleButtonTextActive: {
      color: COLORS.primaryDark,
    },

    logoBig: {
      width: 200,
      height: 200,
    },
  });
