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
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles/userAuthStyles";

export default function Signin() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Lexend_400Regular,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   NavigationBar.setBackgroundColorAsync("#F7F9FF");
  //   NavigationBar.setButtonStyleAsync("dark");
  //   NavigationBar.setBehaviorAsync("overlay-swipe");
  // }, []);
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

  const handleSignIn = () => {
    if ( !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
  const validCredentials =
    (email === "example@live.concordia.ca" && password === "password") ||
    (email === "1" && password === "1")  ||
    (email === "security@concordia.ca" && password === "password");

  if (!validCredentials) {
    setError("Incorrect email or password.");
    return;
  }

    setError(null);
    router.push("../home");
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar backgroundColor="#F7F9FF" barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollableContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.logoArea}>
            <Text style={styles.appTitle}>App Name</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Log in to account</Text>

            {/* EMAIL */}
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
                setError(null);
                setMessage(null);
              }}
            />

            {/* PASSWORD */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter password"
                placeholderTextColor="#AABCD4"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                  setMessage(null);
                }}
              />
              <TouchableOpacity
                style={styles.showHideButton}
                onPress={() => setShowPassword((v) => !v)}
                activeOpacity={0.7}
              >
                <Image source={
                  showPassword
                  ? require("../assets/images/iconmonstr-eye-off-thin-240.png")
                  : require("../assets/images/iconmonstr-eye-thin-240.png")
                }
                style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            </View>

            {/* ERROR */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* SIGN IN BUTTON */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleSignIn}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER LINK */}
          <View style={styles.footerRow}>
         <Text style={styles.footerText}>Forgot password? </Text>
            <TouchableOpacity
                activeOpacity={0.7}
                  onPress={() => {
                    if (!email) {
                        setError("Please enter your email first.");
                        return;
                    }
                    setMessage("If that email exists, a reset link has been sent.");
                    }}
            >
        <Text style={styles.footerLink}>Reset it</Text>
            </TouchableOpacity>
        </View>

        {message && (
        <View style={styles.successBox}>
        <Text style={styles.successText}>{message}</Text>
        </View>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
