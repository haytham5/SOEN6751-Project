import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { saveNewReport } from "../data/reportSH";
import { getCurrentUser } from "../utils/authStorage";

interface AdminEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void | Promise<void>;
}

export default function AdminEventModal({
  visible,
  onClose,
  onSubmitSuccess,
}: AdminEventModalProps) {
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("EV");
  const [description, setDescription] = useState("");
  const [eventStartDate, setEventStartDate] = useState(new Date());
  const [eventEndDate, setEventEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const resetForm = () => {
    setName("");
    setBuilding("EV");
    setDescription("");
    setEventStartDate(new Date());
    setEventEndDate(new Date());
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter an event name.");
      return;
    }

    if (eventEndDate <= eventStartDate) {
      setError("End date/time must be after start date/time.");
      return;
    }

    const user = await getCurrentUser();

    await saveNewReport({
      id: Date.now().toString(),
      name: name.trim(),
      description,
      type: "event",
      building,
      floor: "—",
      date: eventStartDate.toISOString().split("T")[0],
      time: formatTime(eventStartDate),
      submittedBy: "admin",
      isScheduledEvent: true,
      eventStartDate: eventStartDate.toISOString(),
      eventEndDate: eventEndDate.toISOString(),
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Scheduled Event</Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Event Name */}
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Career Fair"
              placeholderTextColor="#777"
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError(null);
              }}
            />

            {/* Building */}
            <Text style={styles.label}>Building</Text>
            <View style={styles.dropdown}>
              <Picker selectedValue={building} onValueChange={setBuilding}>
                <Picker.Item label="EV Building" value="EV" />
                <Picker.Item label="Hall Building" value="H" />
                <Picker.Item label="JMSB" value="JMSB" />
                <Picker.Item label="Library (LB)" value="LB" />
                <Picker.Item label="Faubourg (FB)" value="FB" />
              </Picker>
            </View>

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.description}
              placeholder="Brief description of the event..."
              placeholderTextColor="#777"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            {/* Start Date/Time */}
            <Text style={styles.label}>Start</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  📅 {formatDate(eventStartDate)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  🕐 {formatTime(eventStartDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {showStartDatePicker && (
              <DateTimePicker
                value={eventStartDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  if (date) {
                    const updated = new Date(eventStartDate);
                    updated.setFullYear(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    setEventStartDate(updated);
                  }
                }}
              />
            )}

            {showStartTimePicker && (
              <DateTimePicker
                value={eventStartDate}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowStartTimePicker(false);
                  if (date) {
                    const updated = new Date(eventStartDate);
                    updated.setHours(date.getHours(), date.getMinutes());
                    setEventStartDate(updated);
                  }
                }}
              />
            )}

            {/* End Date/Time */}
            <Text style={styles.label}>End</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  📅 {formatDate(eventEndDate)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  🕐 {formatTime(eventEndDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {showEndDatePicker && (
              <DateTimePicker
                value={eventEndDate}
                mode="date"
                display="default"
                minimumDate={eventStartDate}
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  if (date) {
                    const updated = new Date(eventEndDate);
                    updated.setFullYear(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    setEventEndDate(updated);
                  }
                }}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={eventEndDate}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowEndTimePicker(false);
                  if (date) {
                    const updated = new Date(eventEndDate);
                    updated.setHours(date.getHours(), date.getMinutes());
                    setEventEndDate(updated);
                  }
                }}
              />
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Pacifico_400Regular",
    color: "#276389",
  },
  label: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#1F1F1F",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 10,
    padding: 12,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#1F1F1F",
  },
  description: {
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 10,
    padding: 12,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#1F1F1F",
    height: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 10,
    overflow: "hidden",
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDE3EA",
  },
  dateButtonText: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#276389",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    alignItems: "center",
  },
  cancelText: {
    fontFamily: "Lexend_400Regular",
    color: "#5A6B80",
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#276389",
    alignItems: "center",
  },
  submitText: {
    fontFamily: "Lexend_400Regular",
    color: "#FFFFFF",
    fontSize: 15,
  },
});