
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AccessibilitySubtype, saveNewReport } from "../data/reportSH";
import { useTheme } from "../data/themeProvider";
import { styles as importStyles } from "../styles/reportFormModalStyles";
import { getCurrentUser, type UserRole } from "../utils/authStorage";

interface ReportFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void | Promise<void>;
}

const TOTAL_STEPS = 4;

const accessibilityOptions: {
  label: string;
  value: AccessibilitySubtype;
  helper: string;
}[] = [
  {
    label: "Elevator",
    value: "elevator",
    helper: "Broken, unavailable, or not working properly",
  },
  {
    label: "Escalator",
    value: "escalator",
    helper: "Stopped, blocked, or malfunctioning",
  },
  {
    label: "Ramp",
    value: "ramp",
    helper: "Blocked, damaged, or difficult to use",
  },
  {
    label: "Foot Traffic / Crowding",
    value: "foot_traffic",
    helper: "Area too crowded for easy access",
  },
  {
    label: "Other",
    value: "other",
    helper: "Any other accessibility-related issue",
  },
];

const buildingFloors: Record<string, string[]> = {
  EV:   ["1 (Ground Floor)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"],
  H:    ["S2", "S1", "1 (Ground Floor)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  JMSB: ["S2", "S1", "1 (Ground Floor)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
  LB:   ["S1", "1 (Ground Floor)", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  FB:   ["1 (Ground Floor)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

function formatAccessibilityLabel(value?: AccessibilitySubtype) {
  switch (value) {
    case "elevator":
      return "Elevator";
    case "escalator":
      return "Escalator";
    case "ramp":
      return "Ramp";
    case "foot_traffic":
      return "Foot Traffic / Crowding";
    case "other":
      return "Other";
    default:
      return "—";
  }
}

export default function ReportFormModal({
                                          visible,
                                          onClose,
                                          onSubmitSuccess,
                                        }: ReportFormModalProps) {
  const { theme } = useTheme();
  const scheme = theme;
  const styles = importStyles(scheme);

  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("EV");
  const [floor, setFloor] = useState("1");
  const [type, setType] = useState<"protest" | "event" | "accessibility">(
      "protest",
  );
  const [description, setDescription] = useState("");
  const [accessibilitySubtype, setAccessibilitySubtype] =
      useState<AccessibilitySubtype>("elevator");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (visible) {
      getCurrentUser().then((user) => {
        setCurrentUserRole(user?.role ?? null);
      });
    }
  }, [visible]);

  const progressPercent = `${(step / TOTAL_STEPS) * 100}%` as `${number}%`;

  const stepTitle = useMemo(() => {
    switch (step) {
      case 1:
        return "Report Type";
      case 2:
        return "Location";
      case 3:
        return "Details";
      case 4:
        return "Photo & Submit";
      default:
        return "Add Report";
    }
  }, [step]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setStep(1);
    setImage(undefined);
    setName("");
    setBuilding("EV");
    setFloor("1");
    setType("protest");
    setDescription("");
    setAccessibilitySubtype("elevator");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const submitReport = async () => {
    await saveNewReport({
      id: Date.now().toString(),
      name,
      description,
      type,
      building,
      floor,
      image,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      accessibilitySubtype:
          type === "accessibility" ? accessibilitySubtype : undefined,
      submittedBy: currentUserRole ?? "concordian",
      isScheduledEvent: false,
      isSevere: false,
      upvotedBy: [],
      isResolved: false,
    });

    resetForm();
    onClose();

    if (onSubmitSuccess) {
      await onSubmitSuccess();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>What kind of report is this?</Text>

              <View style={styles.dropdown}>
                <Picker selectedValue={type} onValueChange={setType}>
                  <Picker.Item label="Protest" value="protest" />
                  <Picker.Item label="Disruptions" value="event" />
                  <Picker.Item label="Accessibility" value="accessibility" />
                </Picker>
              </View>

              {type === "accessibility" && (
                  <>
                    <Text style={styles.stepLabel}>Accessibility issue type</Text>
                    <Text style={styles.stepHelper}>
                      Choose the option that best describes the accessibility
                      problem.
                    </Text>

                    <View style={styles.choiceGroup}>
                      {accessibilityOptions.map((option) => {
                        const isSelected = accessibilitySubtype === option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                  styles.choiceCard,
                                  isSelected && styles.choiceCardSelected,
                                ]}
                                onPress={() => setAccessibilitySubtype(option.value)}
                                activeOpacity={0.85}
                            >
                              <Text
                                  style={[
                                    styles.choiceTitle,
                                    isSelected && styles.choiceTitleSelected,
                                  ]}
                              >
                                {option.label}
                              </Text>
                              <Text
                                  style={[
                                    styles.choiceHelper,
                                    isSelected && styles.choiceHelperSelected,
                                  ]}
                              >
                                {option.helper}
                              </Text>
                            </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
              )}

              <View style={styles.helperBox}>
                <Text style={styles.helperText}>
                  Choose the category that best matches what you are reporting.
                </Text>
              </View>
            </View>
        );

      case 2:
        return (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Where is it happening?</Text>

              <View style={styles.dropdown}>
                <Picker
                onValueChange={(val: string) => {
                  setBuilding(val);
                  setFloor("1 (Ground Floor)");
                }}
                >
                  <Picker.Item label="EV Building" value="EV" />
                  <Picker.Item label="Hall Building" value="H" />
                  <Picker.Item label="JMSB" value="JMSB" />
                  <Picker.Item label="Library (LB)" value="LB" />
                  <Picker.Item label="Faubourg (FB)" value="FB" />
                </Picker>
              </View>

             <View style={styles.floorHeaderRow}>
                <Text style={styles.stepLabel}>Floor number</Text>
                <Text style={styles.requiredTag}>Required</Text>
              </View>

              <Text style={styles.stepHelper}>
                Select the floor where the issue is happening.
              </Text>

              <View style={styles.dropdown}>
                <Picker
                  selectedValue={floor}
                  onValueChange={(val) => setFloor(val)}
                >
                  {(buildingFloors[building] ?? []).map((f) => (
                    <Picker.Item key={f} label={`Floor ${f}`} value={f} />
                  ))}
                </Picker>
              </View>
            </View>
        );

      case 3:
        return (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Describe the report</Text>

              <TextInput
                  style={styles.input}
                  placeholder="Report name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#8E8E98"
              />

              <TextInput
                  style={styles.description}
                  placeholder="Summary of the event..."
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="#8E8E98"
              />
            </View>
        );

      case 4:
        return (
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Add an optional photo</Text>

              <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text style={styles.imageText}>Tap to add photo</Text>
                )}
              </TouchableOpacity>

              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Review</Text>
                <Text style={styles.reviewText}>Type: {type}</Text>

                {type === "accessibility" && (
                    <Text style={styles.reviewText}>
                      Accessibility type:{" "}
                      {formatAccessibilityLabel(accessibilitySubtype)}
                    </Text>
                )}

                <Text style={styles.reviewText}>Building: {building}</Text>
                <Text style={styles.reviewText}>Floor: {floor || "—"}</Text>
                <Text style={styles.reviewText}>Title: {name || "—"}</Text>
                <Text style={styles.reviewText}>
                  Description: {description || "—"}
                </Text>
              </View>
            </View>
        );

      default:
        return null;
    }
  };

  return (
      <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />

          <View style={styles.modalCard}>
            <View style={styles.header}>
              <View style={styles.headerTextBlock}>
                <Text style={styles.title}>Add Report</Text>
                <Text style={styles.stepTitle}>
                  Step {step} of {TOTAL_STEPS} · {stepTitle}
                </Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={22} color="#5a8c8b" />
              </TouchableOpacity>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: progressPercent }]} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.form}
            >
              {renderStepContent()}
            </ScrollView>

            <View style={styles.footer}>
              {step > 1 ? (
                  <TouchableOpacity style={styles.secondaryButton} onPress={goBack}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                  </TouchableOpacity>
              ) : (
                  <View style={styles.footerSpacer} />
              )}

              {step < TOTAL_STEPS ? (
                  <TouchableOpacity style={styles.submitButton} onPress={goNext}>
                    <Text style={styles.submitText}>Next</Text>
                  </TouchableOpacity>
              ) : (
                  <TouchableOpacity
                      style={styles.submitButton}
                      onPress={submitReport}
                  >
                    <Text style={styles.submitText}>Submit Report</Text>
                  </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
  );
}