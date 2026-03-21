import { router } from "expo-router";
import React from "react";
import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { bottomNavStyles as importStyles } from "../styles/bottomNavStyles";
import { Themes } from "../styles/Themes";

interface AuthRequiredModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthRequiredModal({
  visible,
  onClose,
}: AuthRequiredModalProps) {
  const styles = importStyles(
    useColorScheme() === "dark" ? Themes.dark : Themes.light,
  );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.authModalOverlay} onPress={onClose}>
        <Pressable
          style={styles.authModalCard}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.authModalHeader}>
            <Text style={styles.authModalTitle}>Log in to report</Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.authModalCloseButton}
            >
              <Icon name="close" size={22} color="#276389" />
            </TouchableOpacity>
          </View>

          <Text style={styles.authModalBody}>
            You need to be logged in to submit a report. Creating an account
            lets you share updates with the community more securely.
          </Text>

          <View style={styles.authModalButtons}>
            <TouchableOpacity
              style={styles.authSecondaryButton}
              onPress={() => {
                onClose();
                router.push("/signin");
              }}
            >
              <Text style={styles.authSecondaryButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authPrimaryButton}
              onPress={() => {
                onClose();
                router.push("/signup");
              }}
            >
              <Text style={styles.authPrimaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
