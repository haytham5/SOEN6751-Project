import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "./components/bottomNav";
import BuildingPreferencesWizard from "./components/buildingPreferences";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import { deleteAllReports } from "./data/reportSH";
import { ThemeType, useTheme } from "./data/themeProvider";
import { styles as importStyles } from "./styles/settingsStyles";
import {
    clearCurrentUser,
    getCurrentUser,
    updateCurrentUser,
    type CurrentUser,
} from "./utils/authStorage";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RowProps {
    label: string;
    value: boolean | undefined;
    onChange: ((value: boolean) => void | Promise<void>) | null | undefined;
}

type ActiveTab = "profile" | "settings";

function normalizeSubscriptionId(buildingId?: string): string {
    const value = buildingId?.toLowerCase().trim();

    switch (value) {
        case "ev":
            return "EV";
        case "hall":
        case "hall building":
        case "h":
            return "H";
        case "faubourg":
        case "faubourg building":
        case "fb":
            return "FB";
        case "library":
        case "webster":
        case "webster library":
        case "lb":
            return "LB";
        case "jmsb":
        case "jm":
        case "jmsb/jm":
        case "jmsb / jm":
            return "JMSB";
        default:
            return buildingId ?? "";
    }
}

export default function Settings() {
    const { mode, toggleTheme } = useTheme();
    const { theme } = useTheme();
    const scheme = theme;
    const styles = importStyles(scheme);
    const localStyles = importLocalStyles(scheme);

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
        Lexend_400Regular,
    });

    const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState("");
    const [editedLastName, setEditedLastName] = useState("");
    const [editedPhone, setEditedPhone] = useState("");
    const [editedIdNumber, setEditedIdNumber] = useState("");
    const [nameError, setNameError] = useState("");
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

    const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
    const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);

    const isGuestUser = currentUser?.isGuest ?? true;

    const SettingRow = ({ label, value, onChange }: RowProps) => (
        <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: scheme.border, true: scheme.primary }}
                thumbColor={scheme.white}
            />
        </View>
    );

    const CollapsibleSection = ({
                                    title,
                                    isOpen,
                                    onToggle,
                                    children,
                                }: {
        title: string;
        isOpen: boolean;
        onToggle: () => void;
        children: React.ReactNode;
    }) => (
        <View style={styles.collapsibleSectionWrap}>
            <TouchableOpacity
                style={styles.collapsiblePill}
                onPress={onToggle}
                activeOpacity={0.85}
            >
                <View style={styles.collapsibleLeft}>
                    <Text style={styles.collapsibleTitle}>{title}</Text>
                </View>

                <View style={styles.collapsibleRight}>
                    <Icon
                        name={isOpen ? "expand-less" : "expand-more"}
                        size={24}
                        color="#276389"
                    />
                </View>
            </TouchableOpacity>

            {isOpen ? <View style={styles.collapsibleContentBox}>{children}</View> : null}
        </View>
    );

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(scheme.softBg);
        NavigationBar.setButtonStyleAsync("dark");
        NavigationBar.setBehaviorAsync("overlay-swipe");
    }, [scheme]);

    const loadUser = useCallback(async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user) {
            setEditedFirstName(user.firstName || "");
            setEditedLastName(user.lastName || "");
            setEditedPhone(user.phone || "");
            setEditedIdNumber(user.idNumber || "");
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [loadUser]),
    );

    const handleSaveProfile = async () => {
        if (!currentUser) return;

        const trimmedFirstName = editedFirstName.trim();

        if (!trimmedFirstName) {
            setNameError("First name is required.");
            return;
        }

        setNameError("");

        await updateCurrentUser({
            firstName: trimmedFirstName,
            lastName: editedLastName.trim(),
            phone: editedPhone.trim(),
            idNumber: editedIdNumber.trim(),
        });

        await loadUser();
        setIsEditingProfile(false);
    };

    const handleCancelEdit = () => {
        setEditedFirstName(currentUser?.firstName || "");
        setEditedLastName(currentUser?.lastName || "");
        setEditedPhone(currentUser?.phone || "");
        setEditedIdNumber(currentUser?.idNumber || "");
        setNameError("");
        setIsEditingProfile(false);
    };

    const handleLogout = async () => {
        await clearCurrentUser();
        router.replace("/");
    };

    const roleLabel = useMemo(() => {
        if (currentUser?.isGuest) return "Guest";
        if (currentUser?.role === "security") return "Security";
        if (currentUser?.role === "admin") return "Admin";
        return "Concordian";
    }, [currentUser]);

    const fullName = useMemo(() => {
        if (currentUser?.isGuest) return "Guest User";

        const name = `${currentUser?.firstName ?? ""} ${
            currentUser?.lastName ?? ""
        }`.trim();

        return name || "Guest User";
    }, [currentUser]);

    const initials = useMemo(() => {
        if (currentUser?.isGuest) return "G";

        const first = currentUser?.firstName?.[0] ?? "";
        const last = currentUser?.lastName?.[0] ?? "";
        const value = `${first}${last}`.toUpperCase();

        return value || "U";
    }, [currentUser]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.background}>
            <OfflineBanner />
            <StatusBar backgroundColor={scheme.white} barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.title}>Your Account</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === "profile" && styles.activeTabButton,
                    ]}
                    onPress={() => setActiveTab("profile")}
                >
                    <Text
                        style={[
                            styles.tabButtonText,
                            activeTab === "profile" && styles.activeTabButtonText,
                        ]}
                    >
                        Profile
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === "settings" && styles.activeTabButton,
                    ]}
                    onPress={() => {
                        setActiveTab("settings");
                        setIsEditingProfile(false);
                    }}
                >
                    <Text
                        style={[
                            styles.tabButtonText,
                            activeTab === "settings" && styles.activeTabButtonText,
                        ]}
                    >
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollableContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === "profile" ? (
                    <View style={styles.profileCard}>
                        <View style={styles.profileHero}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarText}>{initials}</Text>
                            </View>

                            <View style={styles.profileHeroText}>
                                <Text style={styles.profileName}>{fullName}</Text>

                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleBadgeText}>{roleLabel}</Text>
                                </View>

                                <Text style={styles.profileSubText}>
                                    ID: {currentUser?.idNumber || "-"}
                                </Text>
                            </View>
                        </View>

                        {isEditingProfile ? (
                            <>
                                <View style={styles.sectionBlock}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>Edit Profile</Text>
                                        <Text style={styles.sectionCaption}>
                                            Fields marked with{" "}
                                            <Text style={styles.requiredStar}>*</Text> are required.
                                        </Text>
                                    </View>

                                    <View style={styles.formCard}>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.profileLabel}>
                                                First Name <Text style={styles.requiredStar}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles.profileInput,
                                                    nameError ? styles.profileInputError : null,
                                                ]}
                                                value={editedFirstName}
                                                onChangeText={(value) => {
                                                    setEditedFirstName(value);
                                                    if (value.trim()) setNameError("");
                                                }}
                                                placeholder="First name"
                                                placeholderTextColor="#8E8E98"
                                            />
                                            {!!nameError && (
                                                <Text style={styles.errorText}>{nameError}</Text>
                                            )}
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.profileLabel}>Last Name</Text>
                                            <TextInput
                                                style={styles.profileInput}
                                                value={editedLastName}
                                                onChangeText={setEditedLastName}
                                                placeholder="Last name"
                                                placeholderTextColor="#8E8E98"
                                            />
                                        </View>


                                        <View style={styles.lockedLabelRow}>
                                            <Text style={styles.profileLabel}>
                                                Account Type <Text style={styles.requiredStar}>*</Text>
                                            </Text>
                                            <View style={styles.lockedBadge}>
                                                <Text style={styles.lockedBadgeText}>Locked</Text>
                                            </View>

                                        </View>
                                        <View style={styles.disabledFieldBox}>
                                            <Text style={styles.disabledFieldText}>{roleLabel}</Text>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.profileLabel}>ID</Text>
                                            <TextInput
                                                style={styles.profileInput}
                                                value={editedIdNumber}
                                                onChangeText={setEditedIdNumber}
                                                placeholder="ID"
                                                placeholderTextColor="#8E8E98"
                                            />
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.profileLabel}>Phone</Text>
                                            <TextInput
                                                style={styles.profileInput}
                                                value={editedPhone}
                                                onChangeText={setEditedPhone}
                                                placeholder="Phone"
                                                placeholderTextColor="#8E8E98"
                                                keyboardType="phone-pad"
                                            />
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <View style={styles.lockedLabelRow}>
                                                <Text style={styles.profileLabel}>
                                                    Email <Text style={styles.requiredStar}>*</Text>
                                                </Text>
                                                <View style={styles.lockedBadge}>
                                                    <Text style={styles.lockedBadgeText}>Locked</Text>
                                                </View>
                                            </View>

                                            <View style={styles.disabledFieldBox}>
                                                <Text style={styles.disabledFieldText}>
                                                    {currentUser?.email || "-"}
                                                </Text>
                                            </View>

                                            <Text style={styles.readOnlyHint}>
                                                This email is linked to the account and cannot be edited.
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.editActionsRow}>
                                    <TouchableOpacity
                                        style={styles.secondaryProfileButton}
                                        onPress={handleCancelEdit}
                                    >
                                        <Text style={styles.secondaryProfileButtonText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.primaryProfileButton}
                                        onPress={handleSaveProfile}
                                    >
                                        <Text style={styles.primaryProfileButtonText}>
                                            Save Changes
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                {isGuestUser ? (
                                    <TouchableOpacity
                                        style={styles.primaryProfileButtonFull}
                                        onPress={() => router.replace("/")}
                                    >
                                        <Text style={styles.primaryProfileButtonText}>
                                            Log In / Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}

                                <CollapsibleSection
                                    title="Personal Information"
                                    isOpen={isPersonalInfoOpen}
                                    onToggle={() => setIsPersonalInfoOpen((prev) => !prev)}
                                >
                                    <View style={styles.infoItem}>
                                        <Text style={styles.profileLabel}>First Name</Text>
                                        <Text style={styles.profileValue}>
                                            {currentUser?.firstName || "-"}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <Text style={styles.profileLabel}>Last Name</Text>
                                        <Text style={styles.profileValue}>
                                            {currentUser?.lastName || "-"}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <Text style={styles.profileLabel}>Account Type</Text>
                                        <Text style={styles.profileValue}>{roleLabel}</Text>
                                    </View>

                                    <View style={styles.infoItemLast}>
                                        <Text style={styles.profileLabel}>ID</Text>
                                        <Text style={styles.profileValue}>
                                            {currentUser?.idNumber || "-"}
                                        </Text>
                                    </View>
                                </CollapsibleSection>

                                <CollapsibleSection
                                    title="Contact Information"
                                    isOpen={isContactInfoOpen}
                                    onToggle={() => setIsContactInfoOpen((prev) => !prev)}
                                >
                                    <View style={styles.infoItem}>
                                        <Text style={styles.profileLabel}>Phone</Text>
                                        <Text style={styles.profileValue}>
                                            {currentUser?.phone || "-"}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItemLast}>
                                        <Text style={styles.profileLabel}>Email</Text>
                                        <Text style={styles.profileValue}>
                                            {currentUser?.email || "-"}
                                        </Text>
                                    </View>
                                </CollapsibleSection>

                                {!isGuestUser && (
                                    <TouchableOpacity
                                        style={styles.primaryProfileButtonFull}
                                        onPress={() => setIsEditingProfile(true)}
                                    >
                                        <Text style={styles.primaryProfileButtonText}>
                                            Edit Profile
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <View style={localStyles.preferencesSection}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>Building Preferences</Text>
                                        <Text style={styles.sectionCaption}>
                                            Manage which buildings you follow and when alerts are active.
                                        </Text>
                                    </View>

                                    {!isGuestUser && (
                                        <TouchableOpacity
                                            style={styles.primaryProfileButtonFull}
                                            onPress={() => setIsPreferencesOpen(true)}
                                        >
                                            <Text style={styles.primaryProfileButtonText}>
                                                Edit Building Preferences
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {currentUser?.buildingPreferences?.length ? (
                                        currentUser.buildingPreferences.map((pref) => {
                                            const enabledDays = pref.dayPreferences.filter(
                                                (d) => d.enabled,
                                            );

                                            return (
                                                <View key={pref.buildingId} style={localStyles.prefCard}>
                                                    <View style={localStyles.prefHeader}>
                                                        <Text style={localStyles.prefTitle}>
                                                            {pref.buildingName}
                                                        </Text>

                                                        <View
                                                            style={[
                                                                localStyles.prefBadge,
                                                                pref.subscribed
                                                                    ? localStyles.prefBadgeActive
                                                                    : localStyles.prefBadgeInactive,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    localStyles.prefBadgeText,
                                                                    pref.subscribed
                                                                        ? localStyles.prefBadgeTextActive
                                                                        : localStyles.prefBadgeTextInactive,
                                                                ]}
                                                            >
                                                                {pref.subscribed ? "Subscribed" : "Not subscribed"}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    {pref.subscribed ? (
                                                        enabledDays.length ? (
                                                            enabledDays.map((day) => (
                                                                <Text key={day.day} style={localStyles.prefMeta}>
                                                                    {day.day}:{" "}
                                                                    {day.allDay
                                                                        ? "All day"
                                                                        : `${day.startTime} - ${day.endTime}`}
                                                                </Text>
                                                            ))
                                                        ) : (
                                                            <Text style={localStyles.prefMeta}>
                                                                No day selected yet
                                                            </Text>
                                                        )
                                                    ) : (
                                                        <Text style={localStyles.prefMeta}>
                                                            Alerts are turned off for this building
                                                        </Text>
                                                    )}
                                                </View>
                                            );
                                        })
                                    ) : (
                                        <Text style={localStyles.emptyPrefText}>
                                            No building preferences saved yet.
                                        </Text>
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                ) : (
                    <>
                        <View style={styles.settingsCard}>
                            <SettingRow
                                label="Dark Mode"
                                value={mode !== "light"}
                                onChange={toggleTheme}
                            />
                        </View>

                        {isGuestUser ? (
                            <TouchableOpacity
                                style={styles.primaryProfileButtonFull}
                                onPress={() => router.replace("/")}
                            >
                                <Text style={styles.primaryProfileButtonText}>
                                    Log In / Sign Up
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.dangerButton}
                                    onPress={handleLogout}
                                >
                                    <Text style={styles.dangerButtonText}>Log Out</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.dangerButtonSecondary}
                                    onPress={() => deleteAllReports()}
                                >
                                    <Text style={styles.dangerButtonSecondaryText}>
                                        Clear Reports
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            <Modal visible={isPreferencesOpen} animationType="slide">
                <SafeAreaView style={styles.preferencesModalScreen}>
                    <BuildingPreferencesWizard
                        showIntro={false}
                        allowSkip={false}
                        showTopHeader
                        title="Edit Preferences"
                        initialPreferences={currentUser?.buildingPreferences ?? []}
                        onCancel={() => setIsPreferencesOpen(false)}
                        // onSave={async (prefs) => {
                        //     await updateCurrentUser({ buildingPreferences: prefs });
                        //     const refreshedUser = await getCurrentUser();
                        //     setCurrentUser(refreshedUser);
                        //     setIsPreferencesOpen(false);
                        // }}

                        onSave={async (prefs) => {
                            await updateCurrentUser({ buildingPreferences: prefs });

                            await AsyncStorage.setItem(
                                "subscriptions",
                                JSON.stringify(
                                    prefs.map((pref) => ({
                                        id: normalizeSubscriptionId(pref.buildingId),
                                        label: pref.buildingName,
                                        isSubscribed: pref.subscribed,
                                    })),
                                ),
                            );

                            const refreshedUser = await getCurrentUser();
                            setCurrentUser(refreshedUser);
                            setIsPreferencesOpen(false);
                        }}
                        saveButtonLabel="Save Changes"
                    />
                </SafeAreaView>
            </Modal>

            <ReportFormModal
                visible={isReportModalVisible}
                onClose={() => setIsReportModalVisible(false)}
                onSubmitSuccess={() => {}}
            />

            <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
        </SafeAreaView>
    );
}

const importLocalStyles = (COLORS: ThemeType) =>
    StyleSheet.create({
        preferencesSection: {
            marginTop: 8,
            marginBottom: 16,
        },

        prefCard: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 18,
            padding: 16,
            marginTop: 12,
        },

        prefHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },

        prefTitle: {
            fontSize: 15,
            fontFamily: "Lexend_400Regular",
            color: COLORS.black,
            flex: 1,
            marginRight: 10,
        },

        prefBadge: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
        },

        prefBadgeActive: {
            backgroundColor: COLORS.tealTint,
            borderWidth: 1,
            borderColor: COLORS.primary,
        },

        prefBadgeInactive: {
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        prefBadgeText: {
            fontSize: 11,
            fontFamily: "Lexend_400Regular",
        },

        prefBadgeTextActive: {
            color: COLORS.primary,
        },

        prefBadgeTextInactive: {
            color: COLORS.muted,
        },

        prefMeta: {
            fontSize: 13,
            fontFamily: "Lexend_400Regular",
            color: COLORS.subtext,
            marginBottom: 4,
            lineHeight: 19,
        },

        emptyPrefText: {
            fontSize: 13,
            fontFamily: "Lexend_400Regular",
            color: COLORS.muted,
            marginTop: 10,
            marginBottom: 6,
            lineHeight: 19,
        },
    });