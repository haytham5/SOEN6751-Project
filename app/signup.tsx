import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { styles } from "./styles/userAuthStyles";
import { addUser, setCurrentUser, UserRole } from "./utils/authStorage";

export default function SignUp() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("concordian");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#F7F9FF");
      NavigationBar.setButtonStyleAsync("dark");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const clearError = () => setError(null);

  const handleContinueAsGuest = async () => {
    setError(null);

    await setCurrentUser({
      firstName: "Guest",
      lastName: "",
      role: "concordian",
      idNumber: "",
      phone: "",
      email: "",
      isGuest: true,
    });

    router.push("/home");
  };

  const validateForm = () => {
    if (
        !firstName.trim() ||
        !lastName.trim() ||
        !idNumber.trim() ||
        !phone.trim() ||
        !email.trim() ||
        !password.trim()
    ) {
      setError("Please fill in all fields.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email.");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
      idNumber: idNumber.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    const result = await addUser(newUser);

    if (!result.ok) {
      setError(result.message || "Unable to create account.");
      return;
    }

    await setCurrentUser({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      idNumber: newUser.idNumber,
      phone: newUser.phone,
      email: newUser.email,
      isGuest: false,
    });

    setError(null);
    router.push("/home");
  };

  return (
      <SafeAreaView style={styles.background}>
        <StatusBar backgroundColor="#F7F9FF" barStyle="dark-content" />

        <TouchableOpacity
            style={[styles.topBackButton, { top: insets.top + 6 }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
        >
          <Text style={styles.topBackText}>← Back</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
          <ScrollView
              contentContainerStyle={styles.scrollableContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoArea}>
              <Text style={styles.appTitle}>App Name</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create an account</Text>

              <Text style={styles.inputLabel}>First name</Text>
              <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#AABCD4"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    clearError();
                  }}
              />

              <Text style={styles.inputLabel}>Last name</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#AABCD4"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    clearError();
                  }}
              />

              <Text style={styles.inputLabel}>Account type</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === "concordian" && styles.roleButtonActive,
                    ]}
                    onPress={() => {
                      setRole("concordian");
                      clearError();
                    }}
                    activeOpacity={0.8}
                >
                  <Text
                      style={[
                        styles.roleButtonText,
                        role === "concordian" && styles.roleButtonTextActive,
                      ]}
                  >
                    Concordian
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === "security" && styles.roleButtonActive,
                    ]}
                    onPress={() => {
                      setRole("security");
                      clearError();
                    }}
                    activeOpacity={0.8}
                >
                  <Text
                      style={[
                        styles.roleButtonText,
                        role === "security" && styles.roleButtonTextActive,
                      ]}
                  >
                    Security
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>
                {role === "security" ? "Employee ID" : "Student ID"}
              </Text>
              <TextInput
                  style={styles.input}
                  placeholder={role === "security" ? "Employee ID" : "Student ID"}
                  placeholderTextColor="#AABCD4"
                  value={idNumber}
                  onChangeText={(text) => {
                    setIdNumber(text);
                    clearError();
                  }}
              />

              <Text style={styles.inputLabel}>Phone number</Text>
              <TextInput
                  style={styles.input}
                  placeholder="5141234567"
                  placeholderTextColor="#AABCD4"
                  value={phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => {
                    setPhone(text);
                    clearError();
                  }}
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                  style={styles.input}
                  placeholder="you@university.ca"
                  placeholderTextColor="#AABCD4"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError();
                  }}
              />

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#AABCD4"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError();
                    }}
                />
                <TouchableOpacity
                    style={styles.showHideButton}
                    onPress={() => setShowPassword((v) => !v)}
                    activeOpacity={0.7}
                >
                  <Image
                      source={
                        showPassword
                            ? require("../assets/images/iconmonstr-eye-off-thin-240.png")
                            : require("../assets/images/iconmonstr-eye-thin-240.png")
                      }
                      style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>
              </View>

              {error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
              )}

              <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.85}
                  onPress={handleSignUp}
              >
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.guestLinkWrapper}
                  activeOpacity={0.7}
                  onPress={handleContinueAsGuest}
              >
                <Text style={styles.guestLink}>Continue as guest</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/signin")}
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}