import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeType, useTheme } from "../data/themeProvider";
import type {
  BuildingPreference,
  DayKey,
  DayPreference,
} from "../utils/authStorage";

const DEFAULT_BUILDINGS = [
  { id: "EV", name: "EV Building" },
  { id: "H", name: "Hall Building" },
  { id: "FB", name: "Faubourg Building" },
  { id: "LB", name: "Webster Library" },
  { id: "JMSB", name: "JMSB / JM" },
] as const;

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type WizardStep = "intro" | number | "review";

interface BuildingPreferencesWizardProps {
  initialPreferences?: BuildingPreference[];
  showIntro?: boolean;
  allowSkip?: boolean;
  onCancel: () => void;
  onSkip?: () => void;
  onSave: (preferences: BuildingPreference[]) => void | Promise<void>;
  saveButtonLabel?: string;
  title?: string;
  showTopHeader?: boolean;
}

const FALLBACK_COLORS = {
  white: "#FFFFFF",
  black: "#111111",
  text: "#1F1F1F",
  subtext: "#4E4E4E",
  muted: "#6B7280",
  primary: "#56bab8",
  primaryDark: "#5a8c8b",
  pink: "#e7548b",
  border: "#E7E7EC",
  softBg: "#F9FAFB",
  tealTint: "#EEF9F8",
};

function normalizeBuildingId(buildingId?: string): string {
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

function makeDefaultPreferences(): BuildingPreference[] {
  return DEFAULT_BUILDINGS.map((building) => ({
    buildingId: building.id,
    buildingName: building.name,
    subscribed: false,
    dayPreferences: DAYS.map((day) => ({
      day,
      enabled: false,
      allDay: true,
      startTime: "08:00",
      endTime: "17:00",
    })),
  }));
}

function normalizePreferences(
    prefs?: BuildingPreference[],
): BuildingPreference[] {
  if (!prefs?.length) return makeDefaultPreferences();

  return DEFAULT_BUILDINGS.map((building) => {
    const existing = prefs.find(
        (p) => normalizeBuildingId(p.buildingId) === building.id,
    );

    if (!existing) {
      return {
        buildingId: building.id,
        buildingName: building.name,
        subscribed: false,
        dayPreferences: DAYS.map((day) => ({
          day,
          enabled: false,
          allDay: true,
          startTime: "08:00",
          endTime: "17:00",
        })),
      };
    }

    return {
      buildingId: building.id,
      buildingName: building.name,
      subscribed: existing.subscribed ?? false,
      dayPreferences: DAYS.map((day) => {
        const existingDay = existing.dayPreferences?.find((d) => d.day === day);
        return (
            existingDay ?? {
              day,
              enabled: false,
              allDay: true,
              startTime: "08:00",
              endTime: "17:00",
            }
        );
      }),
    };
  });
}

function parseTimeToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours ?? 8, minutes ?? 0, 0, 0);
  return date;
}

function formatTimeFromDate(date: Date): string {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function BuildingPreferencesWizard({
                                                    initialPreferences,
                                                    showIntro = false,
                                                    allowSkip = false,
                                                    onCancel,
                                                    onSkip,
                                                    onSave,
                                                    saveButtonLabel = "Save Preferences",
                                                    title = "Building Preferences",
                                                    showTopHeader = false,
                                                  }: BuildingPreferencesWizardProps) {
  const { theme } = useTheme();
  const scheme = theme;
  const colors = {
    ...FALLBACK_COLORS,
    ...(scheme ?? {}),
  };
  const styles = buildingStyles(colors);
  const insets = useSafeAreaInsets();

  const [preferences, setPreferences] = useState<BuildingPreference[]>(
      normalizePreferences(initialPreferences),
  );
  const [step, setStep] = useState<WizardStep>(showIntro ? "intro" : 0);
  const [timePickerState, setTimePickerState] = useState<{
    buildingIndex: number;
    day: DayKey;
    field: "startTime" | "endTime";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastVisitedBuildingStep, setLastVisitedBuildingStep] = useState<number>(
      0,
  );

  const totalProgressSteps = DEFAULT_BUILDINGS.length + 1;

  const currentProgressStep =
      typeof step === "number"
          ? step + 1
          : step === "review"
              ? totalProgressSteps
              : 0;

  const currentBuilding = typeof step === "number" ? preferences[step] : null;

  const selectedCount = useMemo(
      () => preferences.filter((p) => p.subscribed).length,
      [preferences],
  );

  const updateBuilding = (
      buildingIndex: number,
      updater: (building: BuildingPreference) => BuildingPreference,
  ) => {
    setPreferences((prev) =>
        prev.map((item, index) =>
            index === buildingIndex ? updater(item) : item,
        ),
    );
  };

  const setSubscribed = (buildingIndex: number, subscribed: boolean) => {
    updateBuilding(buildingIndex, (building) => ({
      ...building,
      subscribed,
      dayPreferences: subscribed
          ? building.dayPreferences
          : building.dayPreferences.map((day) => ({
            ...day,
            enabled: false,
          })),
    }));
  };

  const toggleDay = (buildingIndex: number, dayKey: DayKey) => {
    updateBuilding(buildingIndex, (building) => ({
      ...building,
      dayPreferences: building.dayPreferences.map((day) =>
          day.day === dayKey ? { ...day, enabled: !day.enabled } : day,
      ),
    }));
  };

  const updateDay = (
      buildingIndex: number,
      dayKey: DayKey,
      updater: (day: DayPreference) => DayPreference,
  ) => {
    updateBuilding(buildingIndex, (building) => ({
      ...building,
      dayPreferences: building.dayPreferences.map((day) =>
          day.day === dayKey ? updater(day) : day,
      ),
    }));
  };

  const applyPreset = (
      buildingIndex: number,
      preset: "weekdays" | "everyday" | "clear",
  ) => {
    updateBuilding(buildingIndex, (building) => ({
      ...building,
      subscribed: preset !== "clear",
      dayPreferences: building.dayPreferences.map((day) => {
        if (preset === "clear") {
          return { ...day, enabled: false };
        }
        if (preset === "weekdays") {
          return {
            ...day,
            enabled: ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day.day),
          };
        }
        return { ...day, enabled: true };
      }),
    }));
  };

  const goToReview = () => {
    if (typeof step === "number") {
      setLastVisitedBuildingStep(step);
    }
    setStep("review");
  };

  const finalizeSave = async () => {
    try {
      setIsSaving(true);
      await onSave(preferences);
    } finally {
      setIsSaving(false);
    }
  };

  const goNext = () => {
    if (step === "intro") {
      setStep(0);
      return;
    }

    if (typeof step === "number") {
      if (step < DEFAULT_BUILDINGS.length - 1) {
        setStep(step + 1);
      } else {
        setStep("review");
      }
    }
  };

  const goBack = () => {
    if (step === "review") {
      setStep(lastVisitedBuildingStep);
      return;
    }

    if (typeof step === "number") {
      if (step === 0) {
        if (showIntro) {
          setStep("intro");
        } else {
          onCancel();
        }
      } else {
        setStep(step - 1);
      }
    }
  };

  const renderProgress = () => {
    if (step === "intro") return null;

    return (
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarTrack} />
          <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(currentProgressStep / totalProgressSteps) * 100}%`,
                },
              ]}
          />

          <View style={styles.progressDotsRow}>
            {Array.from({ length: totalProgressSteps }).map((_, index) => {
              const done = index + 1 <= currentProgressStep;
              return (
                  <View
                      key={index}
                      style={[styles.progressDot, done && styles.progressDotActive]}
                  />
              );
            })}
          </View>

          <Text style={styles.progressText}>
            Step {currentProgressStep} of {totalProgressSteps}
          </Text>
        </View>
    );
  };

  const renderIntro = () => (
      <View style={styles.panel}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          This step is optional. You can choose which buildings you care about, on
          which days, and during which hours you want updates.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>You can always change this later</Text>
          <Text style={styles.infoText}>
            Even if you skip now, you will be able to set or edit these
            preferences later from your Settings page.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
          <Text style={styles.primaryButtonText}>Set preferences now</Text>
        </TouchableOpacity>

        {allowSkip && (
            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => onSkip?.()}
            >
              <Text style={styles.secondaryButtonText}>Skip for now</Text>
            </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.linkButton} onPress={onCancel}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>
  );

  const renderBuildingStep = () => {
    if (typeof step !== "number" || !currentBuilding) return null;

    return (
        <View style={styles.panel}>
          <View style={styles.stepHeader}>
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.stepTitle}>{currentBuilding.buildingName}</Text>
          </View>

          <Text style={styles.stepQuestion}>
            Would you like to subscribe to updates for this building?
          </Text>

          <View style={styles.choiceRow}>
            <TouchableOpacity
                style={[
                  styles.choiceButton,
                  currentBuilding.subscribed && styles.choiceButtonActive,
                ]}
                onPress={() => setSubscribed(step, true)}
            >
              <Text
                  style={[
                    styles.choiceText,
                    currentBuilding.subscribed && styles.choiceTextActive,
                  ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                  styles.choiceButton,
                  !currentBuilding.subscribed && styles.choiceButtonInactive,
                ]}
                onPress={() => setSubscribed(step, false)}
            >
              <Text style={styles.choiceText}>No</Text>
            </TouchableOpacity>
          </View>

          {currentBuilding.subscribed && (
              <>
                <View style={styles.presetRow}>
                  <TouchableOpacity
                      style={styles.presetButton}
                      onPress={() => applyPreset(step, "weekdays")}
                  >
                    <Text style={styles.presetText}>Weekdays</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.presetButton}
                      onPress={() => applyPreset(step, "everyday")}
                  >
                    <Text style={styles.presetText}>Every day</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.presetButton}
                      onPress={() => applyPreset(step, "clear")}
                  >
                    <Text style={styles.presetText}>Clear</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>Choose days and time ranges</Text>

                {currentBuilding.dayPreferences.map((day) => (
                    <View key={day.day} style={styles.dayCard}>
                      <TouchableOpacity
                          style={styles.dayHeader}
                          onPress={() => toggleDay(step, day.day)}
                      >
                        <View style={styles.dayTitleRow}>
                          <View
                              style={[
                                styles.checkbox,
                                day.enabled && styles.checkboxActive,
                              ]}
                          >
                            {day.enabled && <Check size={14} color={colors.white} />}
                          </View>
                          <Text style={styles.dayTitle}>{day.day}</Text>
                        </View>

                        {day.enabled ? (
                            <ChevronRight size={18} color={colors.muted} />
                        ) : null}
                      </TouchableOpacity>

                      {day.enabled && (
                          <View style={styles.dayDetails}>
                            <View style={styles.allDayRow}>
                              <Text style={styles.allDayLabel}>All day</Text>
                              <Switch
                                  value={day.allDay}
                                  onValueChange={(value) =>
                                      updateDay(step, day.day, (d) => ({
                                        ...d,
                                        allDay: value,
                                      }))
                                  }
                                  trackColor={{
                                    false: colors.border,
                                    true: colors.primary,
                                  }}
                                  thumbColor={colors.white}
                              />
                            </View>

                            {!day.allDay && (
                                <View style={styles.timeRow}>
                                  <TouchableOpacity
                                      style={styles.timeButton}
                                      onPress={() =>
                                          setTimePickerState({
                                            buildingIndex: step,
                                            day: day.day,
                                            field: "startTime",
                                          })
                                      }
                                  >
                                    <Clock3 size={16} color={colors.primaryDark} />
                                    <View>
                                      <Text style={styles.timeButtonLabel}>Start</Text>
                                      <Text style={styles.timeButtonText}>
                                        {day.startTime}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                      style={styles.timeButton}
                                      onPress={() =>
                                          setTimePickerState({
                                            buildingIndex: step,
                                            day: day.day,
                                            field: "endTime",
                                          })
                                      }
                                  >
                                    <Clock3 size={16} color={colors.primaryDark} />
                                    <View>
                                      <Text style={styles.timeButtonLabel}>End</Text>
                                      <Text style={styles.timeButtonText}>
                                        {day.endTime}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                            )}
                          </View>
                      )}
                    </View>
                ))}
              </>
          )}

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ChevronLeft size={16} color={colors.subtext} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.footerActions}>
              <TouchableOpacity
                  style={styles.saveDraftButton}
                  onPress={goToReview}
              >
                <Text style={styles.saveDraftButtonText}>Save now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.primaryButtonSmall}
                  onPress={goNext}
              >
                <Text style={styles.primaryButtonText}>
                  {step === DEFAULT_BUILDINGS.length - 1 ? "Review" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  };

  const renderReview = () => (
      <View style={styles.panel}>
        <Text style={styles.title}>Review Preferences</Text>
        <Text style={styles.subtitle}>
          Review your current selections before finalizing your changes.
        </Text>

        <ScrollView
            style={styles.reviewScroll}
            showsVerticalScrollIndicator={false}
        >
          {preferences.map((building) => (
              <View key={building.buildingId} style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>{building.buildingName}</Text>

                {!building.subscribed ? (
                    <Text style={styles.reviewMuted}>Not subscribed</Text>
                ) : building.dayPreferences.filter((d) => d.enabled).length > 0 ? (
                    building.dayPreferences
                        .filter((d) => d.enabled)
                        .map((day) => (
                            <Text key={day.day} style={styles.reviewLine}>
                              {day.day}:{" "}
                              {day.allDay ? "All day" : `${day.startTime} - ${day.endTime}`}
                            </Text>
                        ))
                ) : (
                    <Text style={styles.reviewMuted}>
                      Subscribed, but no days selected
                    </Text>
                )}
              </View>
          ))}
        </ScrollView>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ChevronLeft size={16} color={colors.subtext} />
            <Text style={styles.backButtonText}>Back to editing</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.primaryButtonSmall}
              onPress={finalizeSave}
              disabled={isSaving}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? "Saving..." : saveButtonLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {allowSkip && (
            <TouchableOpacity style={styles.linkButton} onPress={() => onSkip?.()}>
              <Text style={styles.linkText}>
                Skip and continue without preferences
              </Text>
            </TouchableOpacity>
        )}
      </View>
  );

  const renderTimePicker = () => {
    if (!timePickerState) return null;

    const selectedBuilding = preferences[timePickerState.buildingIndex];
    const selectedDay = selectedBuilding.dayPreferences.find(
        (d) => d.day === timePickerState.day,
    );

    if (!selectedDay) return null;

    const currentValue = parseTimeToDate(selectedDay[timePickerState.field]);

    const handleChange = (event: DateTimePickerEvent, picked?: Date) => {
      if (event.type === "dismissed") {
        setTimePickerState(null);
        return;
      }

      if (!picked) {
        setTimePickerState(null);
        return;
      }

      updateDay(timePickerState.buildingIndex, timePickerState.day, (d) => ({
        ...d,
        [timePickerState.field]: formatTimeFromDate(picked),
      }));

      if (Platform.OS !== "ios") {
        setTimePickerState(null);
      }
    };

    if (Platform.OS === "ios") {
      return (
          <Modal transparent animationType="fade" visible>
            <View style={styles.modalOverlay}>
              <Pressable
                  style={styles.modalBackdrop}
                  onPress={() => setTimePickerState(null)}
              />
              <View style={styles.timeModal}>
                <View style={styles.timeModalHeader}>
                  <Text style={styles.timeModalTitle}>
                    Select{" "}
                    {timePickerState.field === "startTime" ? "start" : "end"} time
                  </Text>
                  <TouchableOpacity onPress={() => setTimePickerState(null)}>
                    <X size={20} color={colors.primaryDark} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.timeModalSubtitle}>
                  {selectedBuilding.buildingName} · {selectedDay.day}
                </Text>

                <DateTimePicker
                    value={currentValue}
                    mode="time"
                    display="spinner"
                    onChange={handleChange}
                />

                <TouchableOpacity
                    style={styles.timeDoneButton}
                    onPress={() => setTimePickerState(null)}
                >
                  <Text style={styles.timeDoneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      );
    }

    return (
        <DateTimePicker
            value={currentValue}
            mode="time"
            display="default"
            onChange={handleChange}
        />
    );
  };

  return (
      <View style={styles.container}>
        {showTopHeader && (
            <View
                style={[styles.topHeader, { paddingTop: Math.min(insets.top, 20) }]}
            >
              <TouchableOpacity style={styles.topHeaderButton} onPress={onCancel}>
                <ChevronLeft size={18} color={colors.primaryDark} />
                <Text style={styles.topHeaderButtonText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.topHeaderTitle}>{title}</Text>

              <View style={styles.topHeaderSpacer} />
            </View>
        )}

        <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            {renderProgress()}
            {step === "intro" && renderIntro()}
            {typeof step === "number" && renderBuildingStep()}
            {step === "review" && renderReview()}
          </View>
        </ScrollView>

        {renderTimePicker()}
      </View>
  );
}

const buildingStyles = (COLORS: ThemeType | typeof FALLBACK_COLORS) =>
    StyleSheet.create({
      container: {
        width: "100%",
        flex: 1,
        backgroundColor: COLORS.white,
      },

      topHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        paddingBottom: 14,
      },

      topHeaderButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 4,
      },

      topHeaderButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primaryDark,
      },

      topHeaderTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.black,
      },

      topHeaderSpacer: {
        width: 56,
      },

      scrollArea: {
        flex: 1,
      },

      scrollContent: {
        paddingBottom: 32,
      },

      contentWrapper: {
        paddingTop: 6,
        flexGrow: 1,
      },

      progressWrapper: {
        marginBottom: 18,
        paddingTop: 4,
      },

      progressBarTrack: {
        height: 6,
        borderRadius: 999,
        backgroundColor: COLORS.border,
        position: "absolute",
        left: 0,
        right: 0,
        top: 10,
      },

      progressBarFill: {
        height: 6,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        position: "absolute",
        left: 0,
        top: 10,
      },

      progressDotsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
      },

      progressDot: {
        width: 16,
        height: 16,
        borderRadius: 999,
        backgroundColor: COLORS.border,
      },

      progressDotActive: {
        backgroundColor: COLORS.primary,
      },

      progressText: {
        fontSize: 12,
        color: COLORS.subtext,
        marginTop: 10,
        fontFamily: "Lexend_400Regular",
      },

      panel: {
        backgroundColor: COLORS.white,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 18,
      },

      title: {
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.black,
        marginBottom: 8,
        fontFamily: "Lexend_400Regular",
      },

      subtitle: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.subtext,
        marginBottom: 16,
        fontFamily: "Lexend_400Regular",
      },

      infoCard: {
        backgroundColor: COLORS.tealTint,
        borderRadius: 16,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
      },

      infoTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.black,
        marginBottom: 4,
        fontFamily: "Lexend_400Regular",
      },

      infoText: {
        fontSize: 13,
        lineHeight: 19,
        color: COLORS.primaryDark,
        fontFamily: "Lexend_400Regular",
      },

      primaryButton: {
        backgroundColor: COLORS.pink,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
      },

      primaryButtonSmall: {
        backgroundColor: COLORS.pink,
        borderRadius: 16,
        paddingVertical: 13,
        paddingHorizontal: 18,
        alignItems: "center",
        minWidth: 92,
      },

      primaryButtonText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
      },

      secondaryButton: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: COLORS.softBg,
        marginTop: 10,
      },

      secondaryButtonText: {
        color: COLORS.primaryDark,
        fontWeight: "600",
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
      },

      linkButton: {
        alignItems: "center",
        marginTop: 14,
      },

      linkText: {
        color: COLORS.primaryDark,
        fontSize: 13,
        fontWeight: "600",
        fontFamily: "Lexend_400Regular",
      },

      stepHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      },

      stepTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.black,
        fontFamily: "Lexend_400Regular",
      },

      stepQuestion: {
        fontSize: 14,
        color: COLORS.subtext,
        marginBottom: 14,
        fontFamily: "Lexend_400Regular",
      },

      choiceRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
      },

      choiceButton: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: COLORS.white,
      },

      choiceButtonActive: {
        backgroundColor: COLORS.tealTint,
        borderColor: COLORS.primary,
      },

      choiceButtonInactive: {
        backgroundColor: COLORS.softBg,
      },

      choiceText: {
        color: COLORS.subtext,
        fontWeight: "600",
        fontFamily: "Lexend_400Regular",
      },

      choiceTextActive: {
        color: COLORS.primaryDark,
      },

      presetRow: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 14,
      },

      presetButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.softBg,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border,
      },

      presetText: {
        fontSize: 12,
        color: COLORS.primaryDark,
        fontWeight: "600",
        fontFamily: "Lexend_400Regular",
      },

      sectionLabel: {
        fontSize: 13,
        color: COLORS.subtext,
        fontWeight: "700",
        marginBottom: 10,
        fontFamily: "Lexend_400Regular",
      },

      dayCard: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        backgroundColor: COLORS.white,
      },

      dayHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },

      dayTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },

      checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
      },

      checkboxActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
      },

      dayTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.black,
        fontFamily: "Lexend_400Regular",
      },

      dayDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
      },

      allDayRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },

      allDayLabel: {
        fontSize: 13,
        color: COLORS.subtext,
        fontWeight: "600",
        fontFamily: "Lexend_400Regular",
      },

      timeRow: {
        gap: 10,
        marginTop: 12,
      },

      timeButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: COLORS.tealTint,
      },

      timeButtonLabel: {
        fontSize: 11,
        color: COLORS.muted,
        marginBottom: 2,
        fontFamily: "Lexend_400Regular",
      },

      timeButtonText: {
        color: COLORS.primaryDark,
        fontWeight: "600",
        fontFamily: "Lexend_400Regular",
      },

      footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 18,
        gap: 12,
      },

      footerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flexShrink: 1,
      },

      saveDraftButton: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.tealTint,
        borderRadius: 16,
        paddingVertical: 13,
        paddingHorizontal: 18,
        alignItems: "center",
        minWidth: 90,
      },

      saveDraftButtonText: {
        color: COLORS.primaryDark,
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "Lexend_400Regular",
      },

      backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
      },

      backButtonText: {
        color: COLORS.subtext,
        fontWeight: "600",
        fontFamily: "Lexend_400Regular",
      },

      reviewScroll: {
        maxHeight: 320,
      },

      reviewCard: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        backgroundColor: COLORS.white,
      },

      reviewTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.black,
        marginBottom: 6,
        fontFamily: "Lexend_400Regular",
      },

      reviewLine: {
        fontSize: 13,
        color: COLORS.subtext,
        marginBottom: 3,
        fontFamily: "Lexend_400Regular",
      },

      reviewMuted: {
        fontSize: 13,
        color: COLORS.muted,
        fontFamily: "Lexend_400Regular",
      },

      modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(17,17,17,0.35)",
      },

      modalBackdrop: {
        flex: 1,
      },

      timeModal: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 18,
      },

      timeModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },

      timeModalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.black,
        fontFamily: "Lexend_400Regular",
      },

      timeModalSubtitle: {
        fontSize: 13,
        color: COLORS.subtext,
        marginTop: 6,
        marginBottom: 12,
        fontFamily: "Lexend_400Regular",
      },

      timeDoneButton: {
        marginTop: 12,
        backgroundColor: COLORS.pink,
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: "center",
      },

      timeDoneButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
        fontWeight: "700",
      },
    });