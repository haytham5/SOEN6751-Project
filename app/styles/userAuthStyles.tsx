import { StyleSheet } from "react-native";
import { ThemeType } from "../data/themeProvider";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 2,
      justifyContent: "space-around",
      paddingHorizontal: 24,
      paddingBottom: 48,
    },

    buttonGroupings: {},

    logoArea: {
      alignItems: "center",
      marginTop: 80,
    },

    title: {
      fontFamily: "Lexend_400Regular",
      fontSize: 25,
      color: theme.onSurface,
      marginBottom: 8,
    },

    tagline: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: theme.surfaceTint,
    },

    buttonGroup: {
      gap: 24,
    },

    primaryButton: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
    },

    primaryButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 15,
      color: theme.onPrimary,
      letterSpacing: 0.4,
    },

    secondaryButton: {
      backgroundColor: theme.surfaceContainerLowest,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.outline,
    },

    secondaryButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 15,
      color: theme.onSurface,
      letterSpacing: 0.4,
    },

    ghostButton: {
      alignItems: "center",
      paddingVertical: 12,
      marginTop: 24,
    },

    ghostButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: theme.tertiary,
      textDecorationLine: "underline",
    },

    background: {
      flex: 1,
      backgroundColor: theme.background,
    },

    inputLabel: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: theme.onSurface,
      marginBottom: 6,
      marginTop: 4,
    },

    input: {
      backgroundColor: theme.surfaceBright,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: theme.onSurface,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.outline,
    },

    card: {
      backgroundColor: theme.background,
      borderRadius: 20,
      paddingHorizontal: 24,
      paddingVertical: 28,
      shadowColor: theme.onSurface,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      marginBottom: 24,
    },

    cardTitle: {
      fontFamily: "Lexend_400Regular",
      fontSize: 22,
      color: theme.onSurface,
      marginBottom: 4,
    },

    // cardSubtitle: {
    //   fontFamily: "Lexend_400Regular",
    //   fontSize: 13,
    //   color: "#6B84A3",
    //   marginBottom: 24,
    // },

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

    // showHideText: {
    //   fontFamily: "Lexend_400Regular",
    //   fontSize: 13,
    //   color: theme.onPrimaryContainer,
    // },

    appTitle: {
      fontFamily: "Lexend_400Regular",
      fontSize: 36,
      color: theme.onSurface,
      marginBottom: 6,
    },

    errorBox: {
      backgroundColor: theme.errorContainer,
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
      color: theme.onErrorContainer,
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
      color: theme.tertiary,
    },

    footerLink: {
      fontFamily: "Lexend_400Regular",
      fontSize: 13,
      color: theme.secondary,
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

    // backLink: {
    //   fontFamily: "Lexend_400Regular",
    //   fontSize: 15,
    //   color: "#4D6A85",
    // },

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
      color: theme.tertiary,
    },

    guestLinkWrapper: {
      marginTop: 14,
      alignItems: "center",
    },

    guestLink: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: theme.tertiary,
      textDecorationLine: "underline",
    },

    roleRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
    },

    roleButton: {
      flex: 1,
      backgroundColor: theme.surfaceBright,
      borderWidth: 1,
      borderColor: theme.outline,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },

    roleButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.outline,
    },

    roleButtonText: {
      fontFamily: "Lexend_400Regular",
      fontSize: 14,
      color: theme.onSurfaceVariant,
    },

    roleButtonTextActive: {
      color: theme.onPrimary,
    },
  });
