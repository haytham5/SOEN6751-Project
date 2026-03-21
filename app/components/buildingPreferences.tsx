import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    X,
} from "lucide-react-native";
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

const TIME_OPTIONS = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
];

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
    prefs?: BuildingPreference[]
): BuildingPreference[] {
    if (!prefs?.length) return makeDefaultPreferences();

    return DEFAULT_BUILDINGS.map((building) => {
        const existing = prefs.find(
            (p) => normalizeBuildingId(p.buildingId) === building.id
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
    const insets = useSafeAreaInsets();

    const [preferences, setPreferences] = useState<BuildingPreference[]>(
        normalizePreferences(initialPreferences)
    );

    const [step, setStep] = useState<WizardStep>(showIntro ? "intro" : 0);
    const [timePickerState, setTimePickerState] = useState<{
        buildingIndex: number;
        day: DayKey;
        field: "startTime" | "endTime";
    } | null>(null);

    const totalProgressSteps = DEFAULT_BUILDINGS.length + 1;

    const currentProgressStep =
        typeof step === "number"
            ? step + 1
            : step === "review"
                ? totalProgressSteps
                : 0;

    const currentBuilding =
        typeof step === "number" ? preferences[step] : null;

    const selectedCount = useMemo(
        () => preferences.filter((p) => p.subscribed).length,
        [preferences]
    );

    const updateBuilding = (
        buildingIndex: number,
        updater: (building: BuildingPreference) => BuildingPreference
    ) => {
        setPreferences((prev) =>
            prev.map((item, index) =>
                index === buildingIndex ? updater(item) : item
            )
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
                day.day === dayKey ? { ...day, enabled: !day.enabled } : day
            ),
        }));
    };

    const updateDay = (
        buildingIndex: number,
        dayKey: DayKey,
        updater: (day: DayPreference) => DayPreference
    ) => {
        updateBuilding(buildingIndex, (building) => ({
            ...building,
            dayPreferences: building.dayPreferences.map((day) =>
                day.day === dayKey ? updater(day) : day
            ),
        }));
    };

    const applyPreset = (
        buildingIndex: number,
        preset: "weekdays" | "everyday" | "clear"
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
            setStep(DEFAULT_BUILDINGS.length - 1);
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
                This step is optional. You can choose which buildings you care about,
                on which days, and during which hours you want updates.
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
                    <MapPin size={18} color="#276389" />
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
                                            {day.enabled && <Check size={14} color="#FFFFFF" />}
                                        </View>
                                        <Text style={styles.dayTitle}>{day.day}</Text>
                                    </View>

                                    {day.enabled ? (
                                        <ChevronRight size={18} color="#64748B" />
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
                                                trackColor={{ false: "#D3DCE6", true: "#B39DDB" }}
                                                thumbColor="#FFFFFF"
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
                                                    <Clock3 size={16} color="#276389" />
                                                    <Text style={styles.timeButtonText}>
                                                        Start: {day.startTime}
                                                    </Text>
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
                                                    <Clock3 size={16} color="#276389" />
                                                    <Text style={styles.timeButtonText}>
                                                        End: {day.endTime}
                                                    </Text>
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
                        <ChevronLeft size={16} color="#475569" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButtonSmall} onPress={goNext}>
                        <Text style={styles.primaryButtonText}>
                            {step === DEFAULT_BUILDINGS.length - 1 ? "Review" : "Next"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderReview = () => (
        <View style={styles.panel}>
            <Text style={styles.title}>Review Preferences</Text>
            <Text style={styles.subtitle}>
                You selected {selectedCount} building{selectedCount === 1 ? "" : "s"}.
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
                        ) : (
                            building.dayPreferences
                                .filter((d) => d.enabled)
                                .map((day) => (
                                    <Text key={day.day} style={styles.reviewLine}>
                                        {day.day}:{" "}
                                        {day.allDay
                                            ? "All day"
                                            : `${day.startTime} - ${day.endTime}`}
                                    </Text>
                                ))
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footerRow}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={16} color="#475569" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButtonSmall}
                    onPress={() => onSave(preferences)}
                >
                    <Text style={styles.primaryButtonText}>{saveButtonLabel}</Text>
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
            (d) => d.day === timePickerState.day
        );

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
                                <X size={20} color="#111827" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.timeModalSubtitle}>
                            {selectedBuilding.buildingName} · {selectedDay?.day}
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {TIME_OPTIONS.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={styles.timeOption}
                                    onPress={() => {
                                        updateDay(
                                            timePickerState.buildingIndex,
                                            timePickerState.day,
                                            (d) => ({
                                                ...d,
                                                [timePickerState.field]: time,
                                            })
                                        );
                                        setTimePickerState(null);
                                    }}
                                >
                                    <Text style={styles.timeOptionText}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {showTopHeader && (
                <View style={[styles.topHeader, { paddingTop: Math.min(insets.top, 20) }]}>
                    <TouchableOpacity style={styles.topHeaderButton} onPress={onCancel}>
                        <ChevronLeft size={18} color="#334155" />
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

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
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
        color: "#334155",
    },
    topHeaderTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },
    topHeaderSpacer: {
        width: 56,
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
        backgroundColor: "#E5EAF1",
        position: "absolute",
        left: 0,
        right: 0,
        top: 10,
    },
    progressBarFill: {
        height: 6,
        borderRadius: 999,
        backgroundColor: "#276389",
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
        backgroundColor: "#D5DEE8",
    },
    progressDotActive: {
        backgroundColor: "#276389",
    },
    progressText: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 10,
    },
    panel: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E5EAF1",
        padding: 18,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        color: "#64748B",
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 14,
        marginBottom: 18,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 19,
        color: "#64748B",
    },
    primaryButton: {
        backgroundColor: "#276389",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 10,
    },
    primaryButtonSmall: {
        backgroundColor: "#276389",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: "#D7E0EA",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "#334155",
        fontWeight: "600",
        fontSize: 14,
    },
    linkButton: {
        alignItems: "center",
        marginTop: 14,
    },
    linkText: {
        color: "#276389",
        fontSize: 13,
        fontWeight: "600",
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
        color: "#1E293B",
    },
    stepQuestion: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 14,
    },
    choiceRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    choiceButton: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D7E0EA",
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    choiceButtonActive: {
        backgroundColor: "#E8F1F7",
        borderColor: "#276389",
    },
    choiceButtonInactive: {
        backgroundColor: "#F8FAFC",
    },
    choiceText: {
        color: "#334155",
        fontWeight: "600",
    },
    choiceTextActive: {
        color: "#276389",
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
        backgroundColor: "#F1F5F9",
        borderRadius: 999,
    },
    presetText: {
        fontSize: 12,
        color: "#334155",
        fontWeight: "600",
    },
    sectionLabel: {
        fontSize: 13,
        color: "#475569",
        fontWeight: "700",
        marginBottom: 10,
    },
    dayCard: {
        borderWidth: 1,
        borderColor: "#E5EAF1",
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
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
        borderColor: "#CBD5E1",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    checkboxActive: {
        backgroundColor: "#276389",
        borderColor: "#276389",
    },
    dayTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
    },
    dayDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEF2F6",
    },
    allDayRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    allDayLabel: {
        fontSize: 13,
        color: "#334155",
        fontWeight: "600",
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
        borderColor: "#D7E0EA",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#F8FAFC",
    },
    timeButtonText: {
        color: "#276389",
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 18,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    backButtonText: {
        color: "#475569",
        fontWeight: "600",
    },
    reviewScroll: {
        maxHeight: 320,
    },
    reviewCard: {
        borderWidth: 1,
        borderColor: "#E5EAF1",
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
    },
    reviewTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 6,
    },
    reviewLine: {
        fontSize: 13,
        color: "#475569",
        marginBottom: 3,
    },
    reviewMuted: {
        fontSize: 13,
        color: "#94A3B8",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    modalBackdrop: {
        flex: 1,
    },
    timeModal: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 18,
        maxHeight: "60%",
    },
    timeModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeModalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    timeModalSubtitle: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 6,
        marginBottom: 12,
    },
    timeOption: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },
    timeOptionText: {
        fontSize: 15,
        color: "#1E293B",
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
});