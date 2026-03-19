import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { router, useFocusEffect } from "expo-router";
import { Pencil } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "./components/bottomNav";
import { deleteAllReports } from "./data/reportSH";
import { styles } from "./styles/settingsStyles";
import {
  clearCurrentUser,
  getCurrentUser,
  updateCurrentUser,
  type CurrentUser,
} from "./utils/authStorage";

interface RowProps {
  label: string;
  value: boolean | undefined;
  onChange: ((value: boolean) => void | Promise<void>) | null | undefined;
}

type ActiveTab = "profile" | "settings";

export default function Settings() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const [lightMode, setLightMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [accessibility, setAccessibility] = useState(true);

  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const SettingRow = ({ label, value, onChange }: RowProps) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#ccc", true: "#b39ddb" }}
        thumbColor="#ffffff"
      />
    </View>
  );

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#F7F9FF");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user) {
          setEditedFirstName(user.firstName || "");
          setEditedLastName(user.lastName || "");
          setEditedPhone(user.phone || "");
          setEditedEmail(user.email || "");
        }
      };

      loadUser();
    }, []),
  );

  const handleEditPress = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    await updateCurrentUser({
      firstName: editedFirstName,
      lastName: editedLastName,
      phone: editedPhone,
      email: editedEmail,
    });

    const refreshedUser = await getCurrentUser();
    setCurrentUser(refreshedUser);
    setIsEditingProfile(false);
  };

  const handleLogout = async () => {
    await clearCurrentUser();
    router.replace("/");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Your Account</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "profile" && styles.activeTabButton,
          ]}
          onPress={() => {
            setActiveTab("profile");
          }}
          activeOpacity={0.8}
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
          activeOpacity={0.8}
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
            {isEditingProfile ? (
              <>
                <Text style={styles.profileName}>Edit Profile</Text>

                <Text style={styles.profileLabel}>First Name</Text>
                <TextInput
                  style={styles.profileInput}
                  value={editedFirstName}
                  onChangeText={setEditedFirstName}
                  placeholder="First name"
                  placeholderTextColor="#AABCD4"
                />

                <Text style={styles.profileLabel}>Last Name</Text>
                <TextInput
                  style={styles.profileInput}
                  value={editedLastName}
                  onChangeText={setEditedLastName}
                  placeholder="Last name"
                  placeholderTextColor="#AABCD4"
                />

                <Text style={styles.profileLabel}>Role</Text>
                <View style={styles.profileReadOnlyBox}>
                  <Text style={styles.profileReadOnlyText}>
                    {currentUser?.isGuest ? "Guest" : currentUser?.role || "-"}
                  </Text>
                </View>

                <Text style={styles.profileLabel}>ID Number</Text>
                <View style={styles.profileReadOnlyBox}>
                  <Text style={styles.profileReadOnlyText}>
                    {currentUser?.idNumber || "-"}
                  </Text>
                </View>

                <Text style={styles.profileLabel}>Phone</Text>
                <TextInput
                  style={styles.profileInput}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Phone"
                  placeholderTextColor="#AABCD4"
                  keyboardType="phone-pad"
                />

                <Text style={styles.profileLabel}>Email</Text>
                <TextInput
                  style={styles.profileInput}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Email"
                  placeholderTextColor="#AABCD4"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <Text style={styles.profileName}>
                  {currentUser?.isGuest
                    ? "Guest User"
                    : `${currentUser?.firstName ?? ""} ${
                        currentUser?.lastName ?? ""
                      }`.trim() || "No user loaded"}
                </Text>

                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Role</Text>
                  <Text style={styles.profileValue}>
                    {currentUser?.isGuest ? "Guest" : currentUser?.role || "-"}
                  </Text>
                </View>

                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>ID Number</Text>
                  <Text style={styles.profileValue}>
                    {currentUser?.idNumber || "-"}
                  </Text>
                </View>

                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Phone</Text>
                  <Text style={styles.profileValue}>
                    {currentUser?.phone || "-"}
                  </Text>
                </View>

                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Email</Text>
                  <Text style={styles.profileValue}>
                    {currentUser?.email || "-"}
                  </Text>
                </View>
              </>
            )}
          </View>
        ) : (
          <>
            <SettingRow
              label="Light Mode"
              value={lightMode}
              onChange={setLightMode}
            />

            <SettingRow
              label="Notifications"
              value={notifications}
              onChange={setNotifications}
            />

            <SettingRow
              label="Accessibility"
              value={accessibility}
              onChange={setAccessibility}
            />

            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Text style={styles.logoutLabel}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logout}
              onPress={() => deleteAllReports()}
            >
              <Text style={styles.logoutLabel}>Clear Reports</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {activeTab === "profile" && (
        <TouchableOpacity
          style={styles.floatingEditButton}
          activeOpacity={0.85}
          onPress={isEditingProfile ? handleSaveProfile : handleEditPress}
        >
          {isEditingProfile ? (
            <Text style={styles.floatingEditButtonText}>Save</Text>
          ) : (
            <Pencil size={20} color="#FFFFFF" strokeWidth={2.2} />
          )}
        </TouchableOpacity>
      )}

      <BottomNav />
    </SafeAreaView>
  );
}
