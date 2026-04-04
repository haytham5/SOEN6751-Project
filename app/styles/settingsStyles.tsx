import { StyleSheet } from "react-native";
import { ThemeType } from "../data/themeProvider";

export const styles = (COLORS: ThemeType) =>
    StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: COLORS.white,
            justifyContent: "space-between",
        },

        scrollableContent: {
            paddingTop: 24,
            paddingHorizontal: 22,
            paddingBottom: 130,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 22,
            paddingTop: 12,
            paddingBottom: 4,
        },

        title: {
            fontSize: 28,
            fontFamily: "Lexend_400Regular",
            color: COLORS.black,
            letterSpacing: -0.4,
        },

        tabContainer: {
            flexDirection: "row",
            backgroundColor: COLORS.softBg,
            marginHorizontal: 22,
            marginTop: 14,
            marginBottom: 6,
            borderRadius: 18,
            padding: 4,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        tabButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: "center",
        },

        activeTabButton: {
            backgroundColor: COLORS.pinkTint,
            borderWidth: 1,
            borderColor: COLORS.softPink,
        },

        tabButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.subtext,
        },

        activeTabButtonText: {
            color: COLORS.black,
        },

        profileCard: {
            backgroundColor: COLORS.white,
            borderRadius: 24,
        },

        profileHero: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.tealTint,
            borderRadius: 24,
            paddingVertical: 22,
            paddingHorizontal: 18,
            marginBottom: 26,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        avatarCircle: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
        },

        avatarText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 24,
            color: COLORS.white,
        },

        profileHeroText: {
            flex: 1,
        },

        profileName: {
            fontFamily: "Lexend_400Regular",
            fontSize: 22,
            color: COLORS.black,
            marginBottom: 2,
        },

        roleBadge: {
            alignSelf: "flex-start",
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            marginTop: 6,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        roleBadgeText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.primaryDark,
        },

        profileSubText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.subtext,
            lineHeight: 18,
        },

        sectionBlock: {
            marginTop: 2,
            marginBottom: 26,
        },

        sectionHeader: {
            marginBottom: 12,
        },

        sectionTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 17,
            color: COLORS.black,
            marginBottom: 6,
        },

        sectionCaption: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            lineHeight: 18,
        },

        collapsibleSectionWrap: {
            marginBottom: 18,
        },

        collapsiblePill: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 26,
            minHeight: 82,
            paddingHorizontal: 22,
            paddingVertical: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
        },

        collapsibleLeft: {
            flex: 1,
            paddingRight: 12,
        },

        collapsibleTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 17,
            color: COLORS.black,
        },

        collapsibleRight: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 34,
        },

        collapsibleChevron: {
            fontFamily: "Lexend_400Regular",
            fontSize: 28,
            color: COLORS.primaryDark,
            lineHeight: 28,
            fontWeight: "700",
        },

        collapsibleContentBox: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 24,
            marginTop: 10,
            paddingHorizontal: 22,
            paddingVertical: 18,
        },

        infoItem: {
            paddingBottom: 16,
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
        },

        infoItemLast: {
            paddingBottom: 0,
            marginBottom: 0,
        },

        formCard: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },

        inputGroup: {
            marginBottom: 18,
        },

        profileLabel: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.muted,
            marginBottom: 6,
        },

        requiredStar: {
            color: COLORS.pink,
        },

        profileValue: {
            fontFamily: "Lexend_400Regular",
            fontSize: 16,
            color: COLORS.black,
            lineHeight: 22,
        },

        profileInput: {
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 13,
            fontFamily: "Lexend_400Regular",
            fontSize: 15,
            color: COLORS.black,
        },

        profileInputError: {
            borderColor: COLORS.pink,
        },

        errorText: {
            marginTop: 8,
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.pink,
            lineHeight: 16,
        },

        profileReadOnlyBox: {
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 13,
        },

        profileReadOnlyText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 15,
            color: COLORS.subtext,
        },

        lockedLabelRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
        },

        lockedBadge: {
            backgroundColor: COLORS.lavenderTint,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },

        lockedBadgeText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 11,
            color: COLORS.lavender,
        },

        disabledFieldBox: {
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 13,
            opacity: 0.75,
        },

        disabledFieldText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 15,
            color: COLORS.muted,
        },

        readOnlyHint: {
            marginTop: 8,
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            lineHeight: 17,
        },

        primaryProfileButtonFull: {
            backgroundColor: COLORS.pink,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            width: "100%",
        },

        primaryProfileButton: {
            flex: 1,
            backgroundColor: COLORS.pink,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
        },

        primaryProfileButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.white,
        },

        secondaryProfileButton: {
            flex: 1,
            backgroundColor: COLORS.softBg,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        secondaryProfileButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.primaryDark,
        },

        editActionsRow: {
            flexDirection: "row",
            columnGap: 12,
            marginTop: 4,
            marginBottom: 12,
        },

        settingsCard: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 20,
        },

        settingRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 18,
            paddingVertical: 18,
        },

        settingLabel: {
            fontSize: 16,
            fontFamily: "Lexend_400Regular",
            color: COLORS.black,
        },

        dangerButton: {
            backgroundColor: COLORS.pinkTint,
            borderRadius: 18,
            paddingVertical: 15,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#F4C9D9",
        },

        dangerButtonText: {
            fontSize: 16,
            fontFamily: "Lexend_400Regular",
            color: COLORS.pink,
        },

        dangerButtonSecondary: {
            backgroundColor: COLORS.lavenderTint,
            borderRadius: 18,
            paddingVertical: 15,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#DDDCEF",
        },

        dangerButtonSecondaryText: {
            fontSize: 16,
            fontFamily: "Lexend_400Regular",
            color: COLORS.lavender,
        },

        preferencesModalScreen: {
            flex: 1,
            backgroundColor: COLORS.white,
            paddingHorizontal: 16,
            paddingTop: 8,
        },
    });