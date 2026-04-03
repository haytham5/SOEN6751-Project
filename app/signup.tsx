import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import {
  Asterisk,
  ChevronLeft,
  CircleAlert,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BuildingPreferencesWizard from "./components/buildingPreferences";
import { useTheme } from "./data/themeProvider";
import { styles as importStyles } from "./styles/userAuthStyles";
import {
  addUser,
  setCurrentUser,
  type BuildingPreference,
} from "./utils/authStorage";

type SignUpStep = "account" | "preferences";

export default function SignUp() {
  const { theme } = useTheme();
  const scheme = theme;
  const styles = importStyles(scheme);

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<SignUpStep>("account");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(scheme.softBg);
      NavigationBar.setButtonStyleAsync("dark");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  if (!fontsLoaded) return null;

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
      buildingPreferences: [],
    });

    router.push("/home");
  };

  const validateAccountForm = () => {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
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

    if (!email.trim().toLowerCase().endsWith("concordia.ca")) {
      setError("Please use your Concordia email address.");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateAccountForm()) return;
    setError(null);
    setStep("preferences");
  };

  const createAccount = async (prefs: BuildingPreference[]) => {
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: "concordian" as const,
      idNumber: idNumber.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password,
      buildingPreferences: prefs,
    };

    const result = await addUser(newUser);

    if (!result.ok) {
      setError(result.message || "Unable to create account.");
      setStep("account");
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
      buildingPreferences: prefs,
    });

    router.push("/home");
  };

  const RequiredLabel = ({ label }: { label: string }) => (
    <View style={localStyles.labelRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Asterisk size={12} color="#e7548b" strokeWidth={2.5} />
    </View>
  );

  const OptionalLabel = ({ label }: { label: string }) => (
    <Text style={styles.inputLabel}>{label}</Text>
  );

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar backgroundColor={scheme.white} barStyle="dark-content" />

      <TouchableOpacity
        style={[styles.topBackButton, { top: insets.top + 6 }]}
        onPress={() => {
          if (step === "preferences") {
            setStep("account");
            return;
          }
          router.back();
        }}
        activeOpacity={0.7}
      >
        <View style={localStyles.backRow}>
          {step === "preferences" && <ChevronLeft size={16} color="#5a8c8b" />}
          <Text style={styles.topBackText}>
            {step === "preferences" ? "Back to account form" : "← Back"}
          </Text>
        </View>
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
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logoBig}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Compass</Text>
          </View>

          <View style={styles.card}>
            {step === "account" ? (
              <>
                <Text style={styles.cardTitle}>Create an account</Text>

                <View style={localStyles.requiredInfoBox}>
                  <CircleAlert size={16} color="#7A3E00" />
                  <Text style={localStyles.requiredInfoText}>
                    Fields marked with this icon (*) are mandatory.
                  </Text>
                </View>

                <RequiredLabel label="First name" />
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#8E8E98"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    clearError();
                  }}
                />

                <OptionalLabel label="Last name" />
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#8E8E98"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    clearError();
                  }}
                />

                {/* <RequiredLabel label="Account type" />
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

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === "admin" && styles.roleButtonActive,
                    ]}
                    onPress={() => {
                      setRole("admin");
                      clearError();
                    }}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === "admin" && styles.roleButtonTextActive,
                      ]}
                    >
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View> */}

                <OptionalLabel label="Student ID" />
                <TextInput
                  style={styles.input}
                  placeholder="Student ID"
                  placeholderTextColor="#8E8E98"
                  value={idNumber}
                  onChangeText={(text) => {
                    setIdNumber(text);
                    clearError();
                  }}
                />

                <OptionalLabel label="Phone number" />
                <TextInput
                  style={styles.input}
                  placeholder="5141234567"
                  placeholderTextColor="#8E8E98"
                  value={phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => {
                    setPhone(text);
                    clearError();
                  }}
                />

                <RequiredLabel label="Email" />
                <TextInput
                  style={styles.input}
                  placeholder="you@concordia.ca"
                  placeholderTextColor="#8E8E98"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError();
                  }}
                />

                <RequiredLabel label="Password" />
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#8E8E98"
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
                  >
                    {showPassword ? (
                      <EyeOff size={22} color="#5a8c8b" />
                    ) : (
                      <Eye size={22} color="#5a8c8b" />
                    )}
                  </TouchableOpacity>
                </View>

                {error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleNextStep}
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.guestLinkWrapper}
                  onPress={handleContinueAsGuest}
                >
                  <Text style={styles.guestLink}>Continue without account</Text>
                </TouchableOpacity>
              </>
            ) : (
              <BuildingPreferencesWizard
                showIntro
                allowSkip
                initialPreferences={[]}
                onCancel={() => setStep("account")}
                onSkip={() => createAccount([])}
                onSave={(prefs) => createAccount(prefs)}
                saveButtonLabel="Create Account"
              />
            )}
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signin")}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// const localStyles = StyleSheet.create({
//     labelRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 6,
//         marginBottom: 6,
//     },
//     requiredInfoBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 8,
//         backgroundColor: "#FFF4E5",
//         borderRadius: 12,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         marginBottom: 18,
//     },
//     requiredInfoText: {
//         color: "#7A3E00",
//         fontSize: 13,
//         flex: 1,
//     },
//     backRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 4,
//     },
// });
const localStyles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  requiredInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FCEAF1",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F1C8D9",
  },

  requiredInfoText: {
    color: "#8E3B62",
    fontSize: 13,
    flex: 1,
    fontFamily: "Lexend_400Regular",
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
