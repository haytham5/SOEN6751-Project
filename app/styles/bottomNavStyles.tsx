import { Platform, StyleSheet } from "react-native";

export const bottomNavStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  navIconImage: {
    width: 26,
    height: 26,
  },

  activeNavItem: {
    backgroundColor: "#EAF4FA",
    borderRadius: 16,
    paddingVertical: 10,
  },

  activeNavIconImage: {
    width: 28,
    height: 28,
  },
  authModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  authModalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },

  authModalTitle: {
    fontSize: 22,
    fontFamily: "Lexend_400Regular",
    color: "#1F1F1F",
    marginBottom: 10,
  },

  authModalBody: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Lexend_400Regular",
    color: "#3E4B57",
    marginBottom: 20,
  },

  authModalButtons: {
    flexDirection: "row",
    gap: 10,
  },

  authSecondaryButton: {
    flex: 1,
    backgroundColor: "#EEF3F9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  authSecondaryButtonText: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: "#276389",
  },

  authPrimaryButton: {
    flex: 1,
    backgroundColor: "#276389",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  authPrimaryButtonText: {
    fontSize: 15,
    fontFamily: "Lexend_400Regular",
    color: "#FFFFFF",
  },
  authModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  authModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF3F9",
  },
});
