import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { CalendarDays, Check, Clock3, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Report, saveNewReport, updateReport } from "../data/reportSH";
import { ThemeType, useTheme } from "../data/themeProvider";
import { getCurrentUser } from "../utils/authStorage";

interface AdminEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void | Promise<void>;
  existingEvent?: Report | null;
}

type PickerTarget = "startDate" | "startTime" | "endDate" | "endTime" | null;

const Required = () => <Text style={{ color: "#e7548b" }}> *</Text>;

const viableFloors: Record<string, string[]> = {
  EV:   ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"],
  H:    ["S2", "S1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  JMSB: ["S2", "S1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
  LB:   ["S1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  FB:   ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

export default function AdminEventModal({
                                          visible,
                                          onClose,
                                          onSubmitSuccess,
                                          existingEvent = null,
                                        }: AdminEventModalProps) {
  const { theme } = useTheme();
  const scheme = theme;
  const styles = adminEventStyles(scheme);

  const [name, setName] = useState("");
  const [building, setBuilding] = useState("EV");
  const [description, setDescription] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");

  const [allDay, setAllDay] = useState(false);

  const [eventStartDate, setEventStartDate] = useState(new Date());
  const [eventEndDate, setEventEndDate] = useState(() => {
    const next = new Date();
    next.setHours(next.getHours() + 1);
    return next;
  });

  const [activePicker, setActivePicker] = useState<PickerTarget>(null);
  const [error, setError] = useState<string | null>(null);

  const isIOS = Platform.OS === "ios";
  const pickerIsOpen = activePicker !== null;
  const isEditing = !!existingEvent;

  const formatDate = (date: Date) =>
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const startSummary = useMemo(() => {
    return allDay
        ? formatDate(eventStartDate)
        : `${formatDate(eventStartDate)} · ${formatTime(eventStartDate)}`;
  }, [allDay, eventStartDate]);

  const endSummary = useMemo(() => {
    return allDay
        ? formatDate(eventEndDate)
        : `${formatDate(eventEndDate)} · ${formatTime(eventEndDate)}`;
  }, [allDay, eventEndDate]);

  const resetForm = () => {
    const now = new Date();
    const later = new Date();
    later.setHours(later.getHours() + 1);

    setName("");
    setBuilding("EV");
    setFloor("");
    setRoom("");
    setDescription("");
    setAllDay(false);
    setEventStartDate(now);
    setEventEndDate(later);
    setActivePicker(null);
    setError(null);
  };

  useEffect(() => {
    if (!visible) return;

    if (existingEvent) {
      const start = existingEvent.eventStartDate
          ? new Date(existingEvent.eventStartDate)
          : new Date(`${existingEvent.date}T09:00:00`);

      const end = existingEvent.eventEndDate
          ? new Date(existingEvent.eventEndDate)
          : new Date(start.getTime() + 60 * 60 * 1000);

      const eventIsAllDay = existingEvent.time === "All day";

      setName(existingEvent.name ?? "");
      setBuilding(existingEvent.building ?? "EV");
      setDescription(existingEvent.description ?? "");
      setFloor(existingEvent.floor && existingEvent.floor !== "—" ? existingEvent.floor : "");
      setRoom(existingEvent.room ?? "");
      setAllDay(eventIsAllDay);
      setEventStartDate(start);
      setEventEndDate(end);
      setActivePicker(null);
      setError(null);
    } else {
      resetForm();
    }
  }, [visible, existingEvent]);

  const handleClose = () => {
    if (pickerIsOpen) {
      setActivePicker(null);
      return;
    }

    resetForm();
    onClose();
  };

  const clampEndAfterStart = (newStart: Date) => {
    if (eventEndDate <= newStart) {
      const adjustedEnd = new Date(newStart);
      adjustedEnd.setHours(adjustedEnd.getHours() + (allDay ? 24 : 1));
      setEventEndDate(adjustedEnd);
    }
  };

  const updateDatePart = (base: Date, picked: Date) => {
    const next = new Date(base);
    next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
    return next;
  };

  const updateTimePart = (base: Date, picked: Date) => {
    const next = new Date(base);
    next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    return next;
  };

  const openPicker = (target: PickerTarget) => {
    setActivePicker((prev) => (prev === target ? null : target));
  };

  const handleAndroidPickerChange = (
      target: Exclude<PickerTarget, null>,
      event: DateTimePickerEvent,
      picked?: Date,
  ) => {
    if (event.type === "dismissed") {
      setActivePicker(null);
      return;
    }

    if (!picked) {
      setActivePicker(null);
      return;
    }

    if (target === "startDate") {
      const updated = updateDatePart(eventStartDate, picked);
      setEventStartDate(updated);
      clampEndAfterStart(updated);
    }

    if (target === "startTime") {
      const updated = updateTimePart(eventStartDate, picked);
      setEventStartDate(updated);
      clampEndAfterStart(updated);
    }

    if (target === "endDate") {
      const updated = updateDatePart(eventEndDate, picked);
      setEventEndDate(updated);
    }

    if (target === "endTime") {
      const updated = updateTimePart(eventEndDate, picked);
      setEventEndDate(updated);
    }

    setActivePicker(null);
    setError(null);
  };

  const handleIOSInlineChange = (
      target: Exclude<PickerTarget, null>,
      picked?: Date,
  ) => {
    if (!picked) return;

    if (target === "startDate") {
      const updated = updateDatePart(eventStartDate, picked);
      setEventStartDate(updated);
      clampEndAfterStart(updated);
    }

    if (target === "startTime") {
      const updated = updateTimePart(eventStartDate, picked);
      setEventStartDate(updated);
      clampEndAfterStart(updated);
    }

    if (target === "endDate") {
      const updated = updateDatePart(eventEndDate, picked);
      setEventEndDate(updated);
    }

    if (target === "endTime") {
      const updated = updateTimePart(eventEndDate, picked);
      setEventEndDate(updated);
    }

    setError(null);
  };

  const toggleAllDay = (value: boolean) => {
    setAllDay(value);

    if (value) {
      const start = new Date(eventStartDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(eventEndDate);
      end.setHours(23, 59, 0, 0);

      if (end <= start) {
        end.setDate(start.getDate());
        end.setHours(23, 59, 0, 0);
      }

      setEventStartDate(start);
      setEventEndDate(end);
      setActivePicker(null);
    } else {
      const start = new Date(eventStartDate);
      start.setHours(9, 0, 0, 0);

      const end = new Date(eventEndDate);
      if (end <= start) {
        end.setTime(start.getTime());
        end.setHours(10, 0, 0, 0);
      }

      setEventStartDate(start);
      setEventEndDate(end);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter an event name.");
      return;
    }
    const user = await getCurrentUser();

    if (!building) {
      setError("Please select a building.");
      return;
    }

    if (!floor.trim()) {
      setError("Please enter a floor.");
      return;
    }

    if(viableFloors[building] && !viableFloors[building].includes(floor.trim().toUpperCase())) {
      setError("Please enter a valid floor for the selected building.");
      return;
    }

    if (eventEndDate <= eventStartDate) {
      setError("End date/time must be after start date/time.");
      return;
    }

    try {
      if (existingEvent) {
        await updateReport({
          ...existingEvent,
          name: name.trim(),
          description: description.trim(),
          building,
          floor: floor.trim() || "—",
          ...(room.trim() ? { room: room.trim() } : { room: undefined }),
          date: eventStartDate.toISOString().split("T")[0],
          time: allDay ? "All day" : formatTime(eventStartDate),
          eventStartDate: eventStartDate.toISOString(),
          eventEndDate: eventEndDate.toISOString(),
        });
      } else {
        await saveNewReport({
          id: Date.now().toString(),
          name: name.trim(),
          description: description.trim(),
          type: "event",
          building,
          floor: floor.trim() || "—",
          ...(room.trim() ? { room: room.trim() } : {}),
          date: eventStartDate.toISOString().split("T")[0],
          time: allDay ? "All day" : formatTime(eventStartDate),
          submittedBy: "admin",
          // !!!!!!!!!!!!
          createdby: user?.idNumber,
          isScheduledEvent: true,
          eventStartDate: eventStartDate.toISOString(),
          eventEndDate: eventEndDate.toISOString(),
          isSevere: false,
          upvotedBy: [],
          isResolved: false,
        } as any);
      }

      resetForm();
      onClose();

      if (onSubmitSuccess) {
        await onSubmitSuccess();
      }
    } catch (e) {
      console.log("Error saving admin event:", e);
      setError(
          isEditing
              ? "Something went wrong while updating the event."
              : "Something went wrong while saving the event.",
      );
    }
  };

  const renderIOSInlinePicker = (target: Exclude<PickerTarget, null>) => {
    if (!isIOS || activePicker !== target) return null;

    const isDate = target === "startDate" || target === "endDate";
    const value =
        target === "startDate" || target === "startTime"
            ? eventStartDate
            : eventEndDate;

    return (
        <View style={styles.inlinePickerWrap}>
          <DateTimePicker
              value={value}
              mode={isDate ? "date" : "time"}
              display={isDate ? "inline" : "spinner"}
              onChange={(_, picked) => handleIOSInlineChange(target, picked)}
              minimumDate={target === "endDate" ? eventStartDate : undefined}
          />
          <TouchableOpacity
              style={styles.inlineDoneButton}
              onPress={() => setActivePicker(null)}
          >
            <Check size={14} color="#FFFFFF" />
            <Text style={styles.inlineDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
    );
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
                <Text style={styles.title}>
                  {isEditing ? "Edit Scheduled Event" : "Add Scheduled Event"}
                </Text>
                <Text style={styles.stepTitle}>
                  {isEditing
                      ? "Update the event details shown in the calendar"
                      : "Create an event that appears in the events calendar"}
                </Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={22} color="#5a8c8b" />
              </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.form}
            >
              <Text style={styles.label}>
                Event name
                <Required />
              </Text>
              <TextInput
                  style={styles.input}
                  placeholder="e.g. Career Fair"
                  placeholderTextColor="#8E8E98"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    setError(null);
                  }}
              />

              <Text style={styles.label}>
                Building
                <Required />
              </Text>
              <View style={styles.dropdown}>
                <Picker selectedValue={building} onValueChange={setBuilding}>
                  <Picker.Item label="EV Building" value="EV" />
                  <Picker.Item label="Hall Building" value="H" />
                  <Picker.Item label="JMSB" value="JMSB" />
                  <Picker.Item label="Library (LB)" value="LB" />
                  <Picker.Item label="Faubourg (FB)" value="FB" />
                </Picker>
              </View>

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>
                    Floor
                    <Required />
                  </Text>
                  <TextInput
                      style={styles.input}
                      placeholder="e.g. 2"
                      placeholderTextColor="#8E8E98"
                      value={floor}
                      onChangeText={(t) => {
                        setFloor(t);
                        setError(null);
                      }}
                  />
                </View>

                <View style={styles.halfField}>
                  <Text style={styles.label}>Room number</Text>
                  <TextInput
                      style={styles.input}
                      placeholder="e.g. H-820"
                      placeholderTextColor="#8E8E98"
                      value={room}
                      onChangeText={setRoom}
                  />
                </View>
              </View>

              <Text style={styles.label}>Description</Text>
              <Text style={styles.helperText}>
                Add a short summary so students know what the event is about.
              </Text>
              <TextInput
                  style={styles.description}
                  placeholder="Brief description of the event..."
                  placeholderTextColor="#8E8E98"
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
              />

              <View style={styles.allDayRow}>
                <View style={styles.allDayTextWrap}>
                  <Text style={styles.labelNoMargin}>All-day event</Text>
                  <Text style={styles.helperInline}>
                    Turn this on if the event lasts the whole day.
                  </Text>
                </View>

                <Switch
                    value={allDay}
                    onValueChange={toggleAllDay}
                    trackColor={{ false: "#d6b1c3", true: "#56bab8" }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#d6b1c3"
                />
              </View>

              <Text style={styles.label}>
                Start
                <Required />
              </Text>

              <TouchableOpacity
                  style={styles.dateSummaryCard}
                  activeOpacity={0.85}
                  onPress={() => openPicker("startDate")}
              >
                <View style={styles.dateSummaryLeft}>
                  <CalendarDays size={16} color="#5a8c8b" />
                  <View>
                    <Text style={styles.dateSummaryLabel}>Date</Text>
                    <Text style={styles.dateSummaryValue}>
                      {formatDate(eventStartDate)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isIOS
                  ? renderIOSInlinePicker("startDate")
                  : activePicker === "startDate" && (
                  <DateTimePicker
                      value={eventStartDate}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={(event, picked) =>
                          handleAndroidPickerChange("startDate", event, picked)
                      }
                  />
              )}

              {!allDay && (
                  <>
                    <TouchableOpacity
                        style={styles.dateSummaryCard}
                        activeOpacity={0.85}
                        onPress={() => openPicker("startTime")}
                    >
                      <View style={styles.dateSummaryLeft}>
                        <Clock3 size={16} color="#5a8c8b" />
                        <View>
                          <Text style={styles.dateSummaryLabel}>Time</Text>
                          <Text style={styles.dateSummaryValue}>
                            {formatTime(eventStartDate)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {isIOS
                        ? renderIOSInlinePicker("startTime")
                        : activePicker === "startTime" && (
                        <DateTimePicker
                            value={eventStartDate}
                            mode="time"
                            display="default"
                            onChange={(event, picked) =>
                                handleAndroidPickerChange("startTime", event, picked)
                            }
                        />
                    )}
                  </>
              )}

              <Text style={styles.label}>End</Text>

              <TouchableOpacity
                  style={styles.dateSummaryCard}
                  activeOpacity={0.85}
                  onPress={() => openPicker("endDate")}
              >
                <View style={styles.dateSummaryLeft}>
                  <CalendarDays size={16} color="#5a8c8b" />
                  <View>
                    <Text style={styles.dateSummaryLabel}>Date</Text>
                    <Text style={styles.dateSummaryValue}>
                      {formatDate(eventEndDate)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isIOS
                  ? renderIOSInlinePicker("endDate")
                  : activePicker === "endDate" && (
                  <DateTimePicker
                      value={eventEndDate}
                      mode="date"
                      display="default"
                      minimumDate={eventStartDate}
                      onChange={(event, picked) =>
                          handleAndroidPickerChange("endDate", event, picked)
                      }
                  />
              )}

              {!allDay && (
                  <>
                    <TouchableOpacity
                        style={styles.dateSummaryCard}
                        activeOpacity={0.85}
                        onPress={() => openPicker("endTime")}
                    >
                      <View style={styles.dateSummaryLeft}>
                        <Clock3 size={16} color="#5a8c8b" />
                        <View>
                          <Text style={styles.dateSummaryLabel}>Time</Text>
                          <Text style={styles.dateSummaryValue}>
                            {formatTime(eventEndDate)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {isIOS
                        ? renderIOSInlinePicker("endTime")
                        : activePicker === "endTime" && (
                        <DateTimePicker
                            value={eventEndDate}
                            mode="time"
                            display="default"
                            onChange={(event, picked) =>
                                handleAndroidPickerChange("endTime", event, picked)
                            }
                        />
                    )}
                  </>
              )}

              <View style={styles.reviewBlock}>
                <Text style={styles.reviewTitle}>Review</Text>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Event</Text>
                  <Text style={styles.reviewValue}>{name || "—"}</Text>
                </View>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Location</Text>
                  <Text style={styles.reviewValue}>
                    {building}
                    {floor ? ` · Floor ${floor}` : ""}
                    {room ? ` · Room ${room}` : ""}
                  </Text>
                </View>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Time</Text>
                  <Text style={styles.reviewValue}>
                    {startSummary} → {endSummary}
                  </Text>
                </View>
              </View>

              <Text style={styles.requiredNote}>
                <Text style={{ color: scheme.pink }}>*</Text> Required fields
              </Text>

              {error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleClose}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
              >
                <Text style={styles.submitText}>
                  {isEditing ? "Save Changes" : "Add Event"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );
}

const adminEventStyles = (COLORS: ThemeType) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
      },

      backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(17, 17, 17, 0.35)",
      },

      modalCard: {
        backgroundColor: COLORS.white,
        borderRadius: 22,
        padding: 20,
        width: "100%",
        maxHeight: "90%",
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 6,
      },

      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      },

      headerTextBlock: {
        flex: 1,
        paddingRight: 10,
      },

      title: {
        fontSize: 24,
        fontFamily: "Lexend_400Regular",
        color: COLORS.text,
      },

      stepTitle: {
        fontSize: 13,
        fontFamily: "Lexend_400Regular",
        color: COLORS.muted,
        marginTop: 2,
      },

      closeButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
      },

      form: {
        paddingBottom: 8,
      },

      label: {
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
        color: COLORS.text,
        marginBottom: 6,
        marginTop: 14,
      },

      labelNoMargin: {
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
        color: COLORS.text,
      },

      helperText: {
        fontSize: 13,
        color: COLORS.muted,
        marginTop: -2,
        marginBottom: 10,
        lineHeight: 18,
        fontFamily: "Lexend_400Regular",
      },

      helperInline: {
        fontSize: 12,
        color: COLORS.muted,
        marginTop: 2,
        fontFamily: "Lexend_400Regular",
      },

      input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        padding: 12,
        fontFamily: "Lexend_400Regular",
        fontSize: 14,
        color: COLORS.text,
        backgroundColor: COLORS.white,
      },

      description: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        padding: 12,
        fontFamily: "Lexend_400Regular",
        fontSize: 14,
        color: COLORS.text,
        minHeight: 110,
        textAlignVertical: "top",
        backgroundColor: COLORS.white,
      },

      dropdown: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: COLORS.white,
      },

      row: {
        flexDirection: "row",
        gap: 10,
      },

      halfField: {
        flex: 1,
      },

      allDayRow: {
        marginTop: 16,
        padding: 14,
        borderRadius: 16,
        backgroundColor: COLORS.lavenderTint,
        borderWidth: 1,
        borderColor: COLORS.lavender,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      },

      allDayTextWrap: {
        flex: 1,
        paddingRight: 8,
      },

      dateSummaryCard: {
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.tealTint,
      },

      dateSummaryLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },

      dateSummaryLabel: {
        fontSize: 12,
        color: COLORS.muted,
        fontFamily: "Lexend_400Regular",
      },

      dateSummaryValue: {
        fontSize: 14,
        color: COLORS.primaryDark,
        fontFamily: "Lexend_400Regular",
        marginTop: 1,
      },

      inlinePickerWrap: {
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
      },

      inlineDoneButton: {
        alignSelf: "flex-end",
        margin: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      },

      inlineDoneText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "Lexend_400Regular",
      },

      reviewBlock: {
        marginTop: 18,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.softBg,
      },

      reviewTitle: {
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
        color: COLORS.muted,
        marginBottom: 8,
      },

      reviewRow: {
        marginTop: 10,
      },

      reviewLabel: {
        fontSize: 12,
        fontFamily: "Lexend_400Regular",
        color: COLORS.muted,
        marginBottom: 2,
      },

      reviewValue: {
        color: COLORS.primaryDark,
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
        lineHeight: 20,
      },

      requiredNote: {
        marginTop: 10,
        fontSize: 12,
        color: COLORS.muted,
        fontFamily: "Lexend_400Regular",
      },

      errorBox: {
        backgroundColor: COLORS.pinkTint,
        borderRadius: 12,
        padding: 10,
        marginTop: 14,
        borderWidth: 1,
        borderColor: COLORS.softPink,
      },

      errorText: {
        color: COLORS.pink,
        fontSize: 13,
        fontFamily: "Lexend_400Regular",
      },

      footer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16,
      },

      secondaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.lavender,
        alignItems: "center",
        backgroundColor: COLORS.lavenderTint,
      },

      secondaryButtonText: {
        fontFamily: "Lexend_400Regular",
        color: COLORS.primaryDark,
        fontSize: 15,
      },

      submitButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: COLORS.pink,
        alignItems: "center",
      },

      submitText: {
        fontFamily: "Lexend_400Regular",
        color: COLORS.white,
        fontSize: 15,
      },
    });