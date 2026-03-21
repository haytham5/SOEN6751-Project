import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },

  scrollableContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    fontSize: 25,
    fontFamily: "Lexend_400Regular",
    color: "#223A5E",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#EEF3FB",
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
  },

  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E6EDF6",
  },

  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#223A5E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 24,
    color: "#FFFFFF",
  },

  profileHeroText: {
    flex: 1,
  },

  profileName: {
    fontFamily: "Lexend_400Regular",
    fontSize: 22,
    color: "#223A5E",
  },

  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF1FB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 6,
    marginBottom: 6,
  },

  roleBadgeText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#223A5E",
  },

  profileSubText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#7A90A8",
  },

  sectionBlock: {
    marginTop: 8,
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: "#223A5E",
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#F9FBFD",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    borderRadius: 18,
    padding: 14,
  },

  formCard: {
    backgroundColor: "#F9FBFD",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    borderRadius: 18,
    padding: 14,
  },

  infoRow: {
    paddingVertical: 6,
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#EEF3FB",
    marginVertical: 8,
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
    color: "#223A5E",
  },

  profileInput: {
    backgroundColor: "#F7F9FF",
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

  profileReadOnlyBox: {
    backgroundColor: "#EEF3FB",
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

  primaryProfileButtonFull: {
    backgroundColor: "#223A5E",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    width: "100%",
  },

  primaryProfileButton: {
    flex: 1,
    backgroundColor: "#223A5E",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryProfileButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#FFFFFF",
  },

  secondaryProfileButton: {
    flex: 1,
    backgroundColor: "#EEF3FB",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryProfileButtonText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#223A5E",
  },

  editActionsRow: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 8,
    marginBottom: 8,
  },

  settingsCard: {
    backgroundColor: "#F9FBFD",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  settingLabel: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#223A5E",
  },

  settingsDivider: {
    height: 1,
    backgroundColor: "#EEF3FB",
    marginHorizontal: 16,
  },

  dangerButton: {
    backgroundColor: "#FCEBEC",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  dangerButtonText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#C94B56",
  },

  dangerButtonSecondary: {
    backgroundColor: "#FFF6F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  dangerButtonSecondaryText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#D86A6A",
  },

  preferencesModalScreen: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
