import { Platform, StyleSheet } from "react-native";
import { ThemeType } from "../data/themeProvider";

// const COLORS = {
//     white: "#FFFFFF",
//     black: "#111111",
//     text: "#1F1F1F",
//     subtext: "#4E4E4E",
//     muted: "#6B7280",

//     primary: "#56bab8",
//     primaryDark: "#5a8c8b",
//     pink: "#e7548b",
//     lavender: "#9796b8",
//     softPink: "#d6b1c3",

//     border: "#E7E7EC",
//     softBg: "#F9FAFB",
//     tealTint: "#EEF9F8",
//     pinkTint: "#FCEAF1",
//     lavenderTint: "#F3F1FA",
// };

export const styles = (COLORS: ThemeType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: "rgba(17,17,17,0.35)",
    },

    backdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    modalCard: {
      width: "100%",
      maxWidth: 420,
      maxHeight: "88%",
      backgroundColor: COLORS.white,
      borderRadius: 26,
      paddingTop: 18,
      paddingBottom: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
        },
        android: {
          elevation: 8,
        },
      }),
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 12,
      gap: 12,
    },

    headerTextBlock: {
      flex: 1,
    },

    title: {
      fontSize: 26,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      letterSpacing: -0.4,
    },

    stepTitle: {
      marginTop: 4,
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
    },

    closeButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: COLORS.tealTint,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    progressTrack: {
      height: 8,
      backgroundColor: "#F1F3F5",
      borderRadius: 999,
      marginHorizontal: 20,
      overflow: "hidden",
      marginBottom: 8,
    },

    progressFill: {
      height: "100%",
      backgroundColor: COLORS.primary,
      borderRadius: 999,
    },

    form: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 12,
    },

    stepContent: {
      gap: 14,
    },

    stepLabel: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    helperBox: {
      backgroundColor: COLORS.tealTint,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    helperText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.primaryDark,
      lineHeight: 19,
    },

    imageBox: {
      height: 180,
      borderRadius: 18,
      backgroundColor: COLORS.softBg,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    imageText: {
      color: COLORS.subtext,
      fontFamily: "Lexend_400Regular",
    },

    image: {
      width: "100%",
      height: "100%",
      borderRadius: 18,
    },

    input: {
      backgroundColor: COLORS.softBg,
      padding: 14,
      borderRadius: 14,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    description: {
      backgroundColor: COLORS.softBg,
      padding: 14,
      borderRadius: 14,
      minHeight: 120,
      textAlignVertical: "top",
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    dropdown: {
      backgroundColor: COLORS.softBg,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    reviewCard: {
      backgroundColor: COLORS.pinkTint,
      borderRadius: 16,
      padding: 14,
      gap: 6,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    reviewTitle: {
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
      color: COLORS.black,
    },

    reviewText: {
      fontSize: 13,
      fontFamily: "Lexend_400Regular",
      color: COLORS.subtext,
      lineHeight: 19,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 8,
    },

    footerSpacer: {
      flex: 1,
    },

    secondaryButton: {
      flex: 1,
      backgroundColor: COLORS.softBg,
      paddingVertical: 15,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    secondaryButtonText: {
      color: COLORS.primaryDark,
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
    },

    submitButton: {
      flex: 1,
      backgroundColor: COLORS.pink,
      paddingVertical: 15,
      borderRadius: 16,
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
        },
        android: {
          elevation: 2,
        },
      }),
    },

    submitText: {
      color: COLORS.white,
      fontSize: 15,
      fontFamily: "Lexend_400Regular",
    },

    stepHelper: {
      fontSize: 13,
      color: COLORS.muted,
      marginTop: -4,
      marginBottom: 12,
      lineHeight: 18,
    },

    floorHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    },

    requiredTag: {
      fontSize: 11,
      color: COLORS.white,
      backgroundColor: COLORS.pink,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: "hidden",
      fontFamily: "Lexend_400Regular",
    },

    choiceGroup: {
      gap: 10,
      marginTop: 8,
    },

    choiceCard: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: COLORS.white,
    },

    choiceCardSelected: {
      borderColor: COLORS.muted,
      backgroundColor: COLORS.tealTint,
    },

    choiceTitle: {
      fontSize: 15,
      color: COLORS.text,
      fontFamily: "Lexend_400Regular",
      marginBottom: 4,
    },

    choiceTitleSelected: {
      color: "#276389",
    },

    choiceHelper: {
      fontSize: 12,
      color: COLORS.muted,
      lineHeight: 17,
    },

    choiceHelperSelected: {
      color: "#4B6475",
    },

    charCount: {
      position: "absolute",
      bottom: 8,
      right: 10,
      fontSize: 11,
      color: "#aaa",
    },
    charCountMultiline: {
      bottom: 12,
    },
    charCountWarning: {
      color: "#F59E0B",
    },
    charCountLimit: {
      color: "#EF4444",
    },
  });
