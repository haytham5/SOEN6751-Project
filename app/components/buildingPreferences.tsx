import React, { useEffect, useMemo, useState } from "react";
import {
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
    Square,
    SquareCheckBig,
    X,
} from "lucide-react-native";
import {
    type BuildingPreference,
    type DayKey,
    type DayPreference,
} from "../utils/authStorage";
import { ThemeType, useTheme } from "../data/themeProvider";
import DateTimePicker from "@react-native-community/datetimepicker";

const DEFAULT_BUILDINGS = [
    { id: "ev", name: "EV Building" },
    { id: "hall", name: "Hall Building" },
    { id: "faubourg", name: "Faubourg Building" },
    { id: "library", name: "Webster Library" },
    { id: "jmsb", name: "JMSB / JM" },
];

const DAY_ORDER: DayKey[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
];
const DAY_LABELS: Record<DayKey, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
};

const WEEKDAY_SET = new Set<DayKey>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
]);

type WizardStep = 0 | 1 | 2;

interface BuildingPreferencesWizardProps {
    showIntro?: boolean;
    allowSkip?: boolean;
    showTopHeader?: boolean;
    title?: string;
    initialPreferences?: BuildingPreference[];
    saveButtonLabel?: string;
    onSave: (prefs: BuildingPreference[]) => void | Promise<void>;
    onCancel?: () => void;
}

export default function BuildingPreferencesWizard({
                                                      showIntro = true,
                                                      allowSkip = true,
                                                      showTopHeader = false,
                                                      title = "Building Preferences",
                                                      initialPreferences = [],
                                                      saveButtonLabel = "Save Preferences",
                                                      onSave,
                                                      onCancel,
                                                  }: BuildingPreferencesWizardProps) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);
    const insets = useSafeAreaInsets();

    const normalizedInitialPreferences = useMemo(
        () => normalizePreferences(initialPreferences),
        [initialPreferences],
    );

    const [step, setStep] = useState<WizardStep>(showIntro ? 0 : 1);
    const [preferences, setPreferences] = useState<BuildingPreference[]>(
        normalizedInitialPreferences,
    );
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeBuildingIndex, setActiveBuildingIndex] = useState(0);

    // const [timePickerState, setTimePickerState] = useState<{
    //     visible: boolean;
    //     buildingId: string;
    //     dayKey: DayKey;
    //     field: "startTime" | "endTime";
    //     label: string;
    // } | null>(null);

    const [timePickerState, setTimePickerState] = useState<{
        visible: boolean;
        buildingId: string;
        dayKey: DayKey;
        field: "startTime" | "endTime";
        label: string;
        value: Date;
    } | null>(null);

    useEffect(() => {
        setPreferences(normalizedInitialPreferences);
    }, [normalizedInitialPreferences]);

    useEffect(() => {
        setStep(showIntro ? 0 : 1);
    }, [showIntro]);
    const [timeErrors, setTimeErrors] = useState<Record<string, string>>({});

    const hasChanges = useMemo(() => {
        return (
            JSON.stringify(preferences) !==
            JSON.stringify(normalizedInitialPreferences)
        );
    }, [preferences, normalizedInitialPreferences]);

    const subscribedCount = useMemo(
        () => preferences.filter((pref) => pref.subscribed).length,
        [preferences],
    );

    const selectedBuildings = useMemo(
        () => preferences.filter((pref) => pref.subscribed),
        [preferences],
    );

    const TIME_OPTIONS = useMemo(() => {
        const options: string[] = [];

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                options.push(
                    `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
                );
            }
        }

        return options;
    }, []);

    const activeBuilding = preferences[activeBuildingIndex] ?? preferences[0];
    const isFirstBuilding = activeBuildingIndex === 0;
    const isLastBuilding = activeBuildingIndex === preferences.length - 1;

    const handleRequestClose = () => {
        if (hasChanges) {
            setShowExitConfirm(true);
            return;
        }
        onCancel?.();
    };

    const handleSaveAndExit = async () => {
        if (hasTimeErrors) return;

        try {
            setIsSaving(true);
            await onSave(preferences);
            setShowExitConfirm(false);
        } finally {
            setIsSaving(false);
        }
    };


    const handleOpenReview = () => {
        if (!canSave) return;
        setStep(2);
    };

    const handleCommitSave = async () => {
        if (!canSave) return;

        try {
            setIsSaving(true);
            await onSave(preferences);
        } finally {
            setIsSaving(false);
        }
    };

    const openTimePicker = (
        buildingId: string,
        dayKey: DayKey,
        field: "startTime" | "endTime",
        label: string,
        currentValue: string,
    ) => {
        setTimePickerState({
            visible: true,
            buildingId,
            dayKey,
            field,
            label,
            value: timeStringToDate(currentValue),
        });
    };

    const closeTimePicker = () => {
        setTimePickerState(null);
    };


    const handleSelectTime = (date: Date) => {
        if (!timePickerState) return;

        updateTime(
            timePickerState.buildingId,
            timePickerState.dayKey,
            timePickerState.field,
            dateToTimeString(date),
        );
    };


    const updateBuilding = (
        buildingId: string,
        updater: (current: BuildingPreference) => BuildingPreference,
    ) => {
        setPreferences((prev) =>
            prev.map((pref) =>
                pref.buildingId === buildingId ? updater(pref) : pref,
            ),
        );
    };

    const toggleSubscribed = (buildingId: string, value: boolean) => {
        updateBuilding(buildingId, (current) => ({
            ...current,
            subscribed: value,
        }));
    };

    const toggleDayEnabled = (
        buildingId: string,
        dayKey: DayKey,
        value: boolean,
    ) => {
        const errorKey = getDayErrorKey(buildingId, dayKey);

        updateBuilding(buildingId, (current) => ({
            ...current,
            dayPreferences: current.dayPreferences.map((day) =>
                day.day === dayKey ? { ...day, enabled: value } : day,
            ),
        }));

        if (!value) {
            setTimeErrors((prev) => {
                const next = { ...prev };
                delete next[errorKey];
                return next;
            });
        }
    };

    const setPresetDays = (
        buildingId: string,
        preset: "weekdays" | "everyday" | "clear",
    ) => {
        updateBuilding(buildingId, (current) => ({
            ...current,
            dayPreferences: current.dayPreferences.map((day) => {
                if (preset === "weekdays") {
                    return { ...day, enabled: WEEKDAY_SET.has(day.day) };
                }
                if (preset === "everyday") {
                    return { ...day, enabled: true };
                }
                return { ...day, enabled: false };
            }),
        }));
    };

    const toggleAllDay = (
        buildingId: string,
        dayKey: DayKey,
        value: boolean,
    ) => {
        const errorKey = getDayErrorKey(buildingId, dayKey);

        updateBuilding(buildingId, (current) => ({
            ...current,
            dayPreferences: current.dayPreferences.map((day) =>
                day.day === dayKey ? { ...day, allDay: value } : day,
            ),
        }));

        if (value) {
            setTimeErrors((prev) => {
                const next = { ...prev };
                delete next[errorKey];
                return next;
            });
        }
    };

    const normalizeTimeString = (time: string) => {
        const [rawHour, rawMinute] = time.split(":").map(Number);
        const hour = Math.max(0, Math.min(23, rawHour || 0));
        const minute = Math.max(0, Math.min(59, rawMinute || 0));

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    };

    const timeStringToDate = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours || 0, minutes || 0, 0, 0);
        return date;
    };

    const dateToTimeString = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };


    const updateTime = (
        buildingId: string,
        dayKey: DayKey,
        field: "startTime" | "endTime",
        nextValue: string,
    ) => {
        const errorKey = getDayErrorKey(buildingId, dayKey);

        setPreferences((prev) =>
            prev.map((pref) => {
                if (pref.buildingId !== buildingId) return pref;

                return {
                    ...pref,
                    dayPreferences: pref.dayPreferences.map((day) => {
                        if (day.day !== dayKey) return day;

                        const safeNextValue = normalizeTimeString(nextValue);

                        const updatedDay = {
                            ...day,
                            [field]: safeNextValue,
                        };

                        const error = getDayTimeError(updatedDay);

                        if (error) {
                            setTimeErrors((prevErrors) => ({
                                ...prevErrors,
                                [errorKey]: error,
                            }));
                            return day; // reject invalid change
                        }

                        setTimeErrors((prevErrors) => {
                            const nextErrors = { ...prevErrors };
                            delete nextErrors[errorKey];
                            return nextErrors;
                        });

                        return updatedDay;
                    }),
                };
            }),
        );
    };

    const cycleTime = (
        current: string,
        direction: "up" | "down",
        stepMinutes = 15,
    ) => {
        const [h, m] = current.split(":").map(Number);
        const totalMinutes = (h || 0) * 60 + (m || 0);

        let nextTotal =
            direction === "up"
                ? totalMinutes + stepMinutes
                : totalMinutes - stepMinutes;

        const minutesInDay = 24 * 60;

        if (nextTotal >= minutesInDay) nextTotal = 0;
        if (nextTotal < 0) nextTotal = minutesInDay - stepMinutes;

        const nextHour = Math.floor(nextTotal / 60);
        const nextMinute = nextTotal % 60;

        return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
    };

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const getDayTimeError = (day: DayPreference) => {
        if (!day.enabled || day.allDay) return "";

        const start = timeToMinutes(day.startTime);
        const end = timeToMinutes(day.endTime);

        if (end <= start) {
            return "End time must be later than start time.";
        }

        return "";
    };

    const hasTimeErrors = useMemo(() => {
        return preferences.some((building) =>
            building.dayPreferences.some((day) => getDayTimeError(day) !== ""),
        );
    }, [preferences]);

    const canSave = hasChanges && !hasTimeErrors && !isSaving;

    const getDayErrorKey = (buildingId: string, dayKey: DayKey) =>
        `${buildingId}-${dayKey}`;

    const renderTopHeader = () => {
        if (!showTopHeader) return null;

        return (
            <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 8) }]}>
                <View style={styles.topHeaderLeft}>
                    <Text style={styles.topHeaderTitle}>{title}</Text>

                </View>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleRequestClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close preferences"
                >
                    <X size={20} color={theme.black} strokeWidth={2.4} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderBuildingProgress = () => {
        if (step !== 1) return null;

        return (
            <View style={styles.progressWrap}>
                <View style={styles.progressBarRow}>
                    {preferences.map((building, index) => {
                        const isActive = index === activeBuildingIndex;
                        const isComplete = index < activeBuildingIndex;
                        const isEnabled = building.subscribed;

                        return (
                            <TouchableOpacity
                                key={building.buildingId}
                                style={[
                                    styles.progressSegment,
                                    isComplete && styles.progressSegmentComplete,
                                    isActive && styles.progressSegmentActive,
                                    isEnabled &&
                                    !isActive &&
                                    !isComplete &&
                                    styles.progressSegmentEnabled,
                                ]}
                                onPress={() => setActiveBuildingIndex(index)}
                                activeOpacity={0.8}
                            />
                        );
                    })}
                </View>

                <View style={styles.progressMetaRow}>
                    <Text style={styles.progressStepText}>
                        Building {activeBuildingIndex + 1} of {preferences.length}
                    </Text>
                    <Text style={styles.progressBuildingName}>
                        {activeBuilding?.buildingName}
                    </Text>
                </View>
            </View>
        );
    };

    const renderIntro = () => (
        <View style={styles.introCard}>
            <Text style={styles.introTitle}>Set your building alerts</Text>
            <Text style={styles.introText}>
                Go building by building and choose exactly which days and times matter
                to you.
            </Text>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStep(1)}
            >
                <Text style={styles.primaryButtonText}>Start</Text>
            </TouchableOpacity>

            {allowSkip && (
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleRequestClose}
                >
                    <Text style={styles.secondaryButtonText}>Skip for now</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderDayCard = (
        buildingId: string,
        dayPref: DayPreference,
        isLast: boolean,
    ) => {
        const dayError = timeErrors[getDayErrorKey(buildingId, dayPref.day)] || "";
        return (
            <View
                key={dayPref.day}
                style={[styles.dayCard, isLast && styles.dayCardLast]}
            >
                <TouchableOpacity
                    style={styles.dayRowTop}
                    activeOpacity={0.8}
                    onPress={() =>
                        toggleDayEnabled(buildingId, dayPref.day, !dayPref.enabled)
                    }
                >
                    <View style={styles.dayTitleWrap}>
                        {/*<Text style={styles.dayTitle}>{dayPref.day}</Text>*/}
                        <Text style={styles.dayTitle}>{DAY_LABELS[dayPref.day]}</Text>
                        <Text style={styles.daySubtitle}>
                            {dayPref.enabled
                                ? dayPref.allDay
                                    ? "All day"
                                    : `${dayPref.startTime} - ${dayPref.endTime}`
                                : "Not selected"}
                        </Text>
                    </View>

                    <View style={styles.checkboxWrap}>
                        {dayPref.enabled ? (
                            <SquareCheckBig
                                size={24}
                                color={theme.primary}
                                strokeWidth={2.2}
                            />
                        ) : (
                            <Square size={24} color={theme.muted} strokeWidth={2.2} />
                        )}
                    </View>
                </TouchableOpacity>

                {dayPref.enabled ? (
                    <>
                        <View style={styles.allDayRow}>
                            <View style={styles.inlineRow}>
                                <Clock3 size={16} color={theme.primaryDark} strokeWidth={2.2} />
                                <Text style={styles.allDayLabel}>All day</Text>
                            </View>

                            <Switch
                                value={dayPref.allDay}
                                onValueChange={(value) =>
                                    toggleAllDay(buildingId, dayPref.day, value)
                                }
                                trackColor={{ false: theme.border, true: theme.primary }}
                                thumbColor={theme.white}
                            />
                        </View>

                        {!dayPref.allDay ? (
                            <>

                                <View style={styles.timeRow}>

                                    <TimeSelectCard
                                        label="Start"
                                        value={dayPref.startTime}
                                        onPress={() =>
                                            openTimePicker(
                                                buildingId,
                                                dayPref.day,
                                                "startTime",
                                                "Select start time",
                                                dayPref.startTime
                                            )
                                        }
                                        theme={theme}
                                    />

                                    <TimeSelectCard
                                        label="End"
                                        value={dayPref.endTime}
                                        onPress={() =>
                                            openTimePicker(
                                                buildingId,
                                                dayPref.day,
                                                "endTime",
                                                "Select end time",
                                                dayPref.endTime
                                            )
                                        }
                                        theme={theme}
                                    />
                                </View>

                                {dayError ? (
                                    <Text style={styles.timeErrorText}>{dayError}</Text>
                                ) : null}
                            </>
                        ) : null}

                    </>
                ) : null}
            </View>
        );
    };


    const renderPreferences = () => (
        <>
            <View style={styles.sectionIntro}>
                <Text style={styles.sectionTitle}>Configure one building at a time</Text>
                <Text style={styles.sectionDescription}>
                    Would you like to subscribe to updates for this building?
                </Text>
            </View>

            <View style={styles.buildingCard}>
                <View style={styles.buildingHeader}>
                    <View style={styles.buildingHeaderLeft}>
                        <View style={styles.buildingIconWrap}>
                            <MapPin size={17} color={theme.primaryDark} strokeWidth={2.2} />
                        </View>

                        <View style={styles.buildingTitleWrap}>
                            <Text style={styles.buildingTitle}>
                                {activeBuilding.buildingName}
                            </Text>
                            <Text style={styles.buildingMeta}>
                                {activeBuilding.subscribed
                                    ? "Alerts enabled for this building"
                                    : "Alerts turned off for this building"}
                            </Text>
                        </View>
                    </View>

                    <Switch
                        value={activeBuilding.subscribed}
                        onValueChange={(value) =>
                            toggleSubscribed(activeBuilding.buildingId, value)
                        }
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor={theme.white}
                    />
                </View>

                {activeBuilding.subscribed ? (
                    <View style={styles.daysList}>
                        <Text style={styles.quickActionsLabel}>Quick select</Text>

                        <View style={styles.quickActionsRow}>
                            <TouchableOpacity
                                style={styles.quickActionButton}
                                onPress={() =>
                                    setPresetDays(activeBuilding.buildingId, "weekdays")
                                }
                            >
                                <Text style={styles.quickActionButtonText}>Weekdays</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionButton}
                                onPress={() =>
                                    setPresetDays(activeBuilding.buildingId, "everyday")
                                }
                            >
                                <Text style={styles.quickActionButtonText}>Every day</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionButton}
                                onPress={() => setPresetDays(activeBuilding.buildingId, "clear")}
                            >
                                <Text style={styles.quickActionButtonText}>Clear</Text>
                            </TouchableOpacity>
                        </View>

                        {activeBuilding.dayPreferences.map((dayPref, index) =>
                            renderDayCard(
                                activeBuilding.buildingId,
                                dayPref,
                                index === activeBuilding.dayPreferences.length - 1,
                            ),
                        )}
                    </View>
                ) : (
                    <View style={styles.disabledStateBox}>
                        <Text style={styles.disabledStateText}>
                            Turn alerts on to choose days and times for this building.
                        </Text>
                    </View>
                )}
            </View>



        </>
    );

    const renderReview = () => (
        <>
            <View style={styles.sectionIntro}>

                <Text style={styles.sectionTitle}>Review before saving</Text>
                <Text style={styles.sectionDescription}>
                    Here is a summary of the alerts you selected. Only subscribed buildings are shown.
                </Text>
            </View>

            {selectedBuildings.length === 0 ? (
                <View style={styles.disabledStateBox}>
                    <Text style={styles.disabledStateText}>
                        You have not selected any buildings yet.
                    </Text>
                </View>
            ) : (
                selectedBuildings.map((building) => {
                    const enabledDays = building.dayPreferences.filter((day) => day.enabled);

                    return (
                        <View key={building.buildingId} style={styles.reviewCard}>
                            <Text style={styles.reviewBuildingTitle}>{building.buildingName}</Text>

                            {enabledDays.length === 0 ? (
                                <Text style={styles.reviewEmptyText}>
                                    Alerts are on, but no days were selected.
                                </Text>
                            ) : (
                                enabledDays.map((day) => (
                                    <View key={day.day} style={styles.reviewRow}>
                                        {/*<Text style={styles.reviewDay}>{day.day}</Text>*/}
                                        <Text style={styles.reviewDay}>{DAY_LABELS[day.day]}</Text>
                                        <Text style={styles.reviewTime}>
                                            {day.allDay
                                                ? "All day"
                                                : `${day.startTime} - ${day.endTime}`}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    );
                })
            )}
        </>
    );

    return (
        <View style={styles.screen}>
            {renderTopHeader()}
            {renderBuildingProgress()}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.contentScroll,
                    { paddingBottom: 150 },
                ]}
            >
                {step === 0
                    ? renderIntro()
                    : step === 1
                        ? renderPreferences()
                        : renderReview()}
            </ScrollView>

            {step !== 0 ? (
                <View
                    style={[
                        styles.stickyFooter,
                        { paddingBottom: Math.max(insets.bottom, 12) },
                    ]}
                >
                    {step === 1 ? (
                        <>
                            <Text style={styles.footerHint}>
                                Building {activeBuildingIndex + 1} of {preferences.length}
                            </Text>

                            <View style={styles.footerNavRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.secondaryFooterButton,
                                        isFirstBuilding && styles.footerButtonDisabled,
                                    ]}
                                    onPress={() =>
                                        !isFirstBuilding &&
                                        setActiveBuildingIndex((prev) => prev - 1)
                                    }
                                    disabled={isFirstBuilding}
                                >
                                    <View style={styles.footerButtonContent}>
                                        <ChevronLeft
                                            size={18}
                                            color={isFirstBuilding ? theme.muted : theme.primaryDark}
                                            strokeWidth={2.5}
                                        />
                                        <Text
                                            style={[
                                                styles.secondaryFooterButtonText,
                                                isFirstBuilding && styles.navButtonTextDisabled,
                                            ]}
                                        >
                                            Previous
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.primaryFooterButton,
                                        isLastBuilding && styles.footerButtonDisabled,
                                    ]}
                                    onPress={() =>
                                        !isLastBuilding &&
                                        setActiveBuildingIndex((prev) => prev + 1)
                                    }
                                    disabled={isLastBuilding}
                                >
                                    <View style={styles.footerButtonContent}>
                                        <Text style={styles.primaryButtonText}>Next</Text>
                                        <ChevronRight size={18} color={theme.white} strokeWidth={2.5} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    styles.footerSaveButton,
                                    !canSave && styles.primaryButtonDisabled,
                                ]}
                                onPress={handleOpenReview}
                                disabled={!canSave}
                            >
                                <Text style={styles.primaryButtonText}>Review & Save</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.reviewFooterRow}>
                            <TouchableOpacity
                                style={styles.secondaryFooterButton}
                                onPress={() => setStep(1)}
                            >
                                <Text style={styles.secondaryFooterButtonText}>Back to Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.primaryFooterButton,
                                    !canSave && styles.primaryButtonDisabled,
                                ]}
                                onPress={handleCommitSave}
                                disabled={!canSave}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {isSaving ? "Saving..." : saveButtonLabel}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : null}

            {timePickerState?.visible ? (
                <View style={styles.confirmOverlay}>
                    <Pressable
                        style={styles.confirmBackdrop}
                        onPress={closeTimePicker}
                    />

                    <View style={styles.timePickerModal}>
                        <Text style={styles.timePickerTitle}>
                            {timePickerState.label}
                        </Text>

                        <View style={styles.wheelPickerWrap}>
                            <DateTimePicker
                                value={timePickerState.value}
                                mode="time"
                                display="spinner"
                                minuteInterval={15}
                                onChange={(_, selectedDate) => {
                                    if (!selectedDate) return;

                                    setTimePickerState((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                value: selectedDate,
                                            }
                                            : prev
                                    );

                                    handleSelectTime(selectedDate);
                                }}
                                textColor={theme.black}
                                style={styles.wheelPicker}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={closeTimePicker}
                        >
                            <Text style={styles.primaryButtonText}>Done</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={closeTimePicker}
                        >
                            <Text style={styles.secondaryButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}

            {showExitConfirm ? (
                <View style={styles.confirmOverlay}>
                    <Pressable
                        style={styles.confirmBackdrop}
                        onPress={() => setShowExitConfirm(false)}
                    />
                    <View style={styles.confirmCard}>
                        <Text style={styles.confirmTitle}>Leave without saving?</Text>
                        <Text style={styles.confirmText}>
                            You have unsaved changes. Would you like to save them before
                            exiting?
                        </Text>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleSaveAndExit}
                            disabled={isSaving}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.exitButton}
                            onPress={() => {
                                setShowExitConfirm(false);
                                requestAnimationFrame(() => {
                                    onCancel?.();
                                });
                            }}
                        >
                            <Text style={styles.exitButtonText}>Exit Without Saving</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => setShowExitConfirm(false)}
                        >
                            <Text style={styles.secondaryButtonText}>Keep Editing</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
        </View>
    );
}

function TimeSelectCard({
                            label,
                            value,
                            onPress,
                            theme,
                        }: {
    label: string;
    value: string;
    onPress: () => void;
    theme: ThemeType;
}) {
    const styles = makeStyles(theme);

    return (
        <TouchableOpacity
            style={styles.timeCard}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.timeLabel}>{label}</Text>

            <View style={styles.timeSelectRow}>
                <Text style={styles.timeValue}>{value}</Text>
                <ChevronRight size={16} color={theme.primaryDark} strokeWidth={2.4} />
            </View>
        </TouchableOpacity>
    );
}
function normalizePreferences(
    initialPreferences: BuildingPreference[],
): BuildingPreference[] {
    const byId = new Map(initialPreferences.map((pref) => [pref.buildingId, pref]));

    return DEFAULT_BUILDINGS.map((building) => {
        const existing = byId.get(building.id);

        return {
            buildingId: building.id,
            buildingName: building.name,
            subscribed: existing?.subscribed ?? false,
            dayPreferences: DAY_ORDER.map((day) => {
                const existingDay = existing?.dayPreferences?.find((d) => d.day === day);
                return {
                    day,
                    enabled: existingDay?.enabled ?? false,
                    allDay: existingDay?.allDay ?? true,
                    startTime: existingDay?.startTime ?? "09:00",
                    endTime: existingDay?.endTime ?? "17:00",
                };
            }),
        };
    });
}

const makeStyles = (COLORS: ThemeType) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: COLORS.white,
        },

        contentScroll: {
            paddingBottom: 30,
        },

        topHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 4,
            paddingBottom: 12,
        },

        topHeaderLeft: {
            flex: 1,
            paddingRight: 12,
        },

        topHeaderTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 24,
            color: COLORS.black,
        },

        topHeaderSubtitle: {
            marginTop: 4,
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.muted,
        },

        closeButton: {
            width: 42,
            height: 42,
            borderRadius: 21,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        progressWrap: {
            paddingHorizontal: 4,
            marginBottom: 16,
        },

        progressBarRow: {
            flexDirection: "row",
            columnGap: 8,
        },

        progressSegment: {
            flex: 1,
            height: 8,
            borderRadius: 999,
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        progressSegmentComplete: {
            backgroundColor: COLORS.primaryDark,
            borderColor: COLORS.primaryDark,
        },

        progressSegmentActive: {
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
        },

        progressSegmentEnabled: {
            backgroundColor: COLORS.tealTint,
            borderColor: COLORS.primary,
        },

        progressMetaRow: {
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        progressStepText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
        },

        progressBuildingName: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.primaryDark,
        },

        introCard: {
            flex: 1,
            justifyContent: "center",
            paddingBottom: 40,
        },

        introTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 24,
            color: COLORS.black,
            textAlign: "center",
            marginBottom: 12,
        },

        introText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            lineHeight: 22,
            color: COLORS.subtext,
            textAlign: "center",
            marginBottom: 28,
            paddingHorizontal: 10,
        },

        sectionIntro: {
            marginBottom: 14,
            paddingHorizontal: 2,
        },

        sectionTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 18,
            color: COLORS.black,
            marginBottom: 6,
        },

        sectionDescription: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            lineHeight: 19,
            color: COLORS.muted,
        },

        buildingCard: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 22,
            padding: 16,
            marginBottom: 14,
        },

        buildingHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },

        buildingHeaderLeft: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            paddingRight: 12,
        },

        buildingIconWrap: {
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: COLORS.tealTint,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
        },

        buildingTitleWrap: {
            flex: 1,
        },

        buildingTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 15,
            color: COLORS.black,
            marginBottom: 2,
        },

        buildingMeta: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            lineHeight: 18,
        },

        daysList: {
            marginTop: 14,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 12,
        },

        quickActionsLabel: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            marginBottom: 10,
        },

        quickActionsRow: {
            flexDirection: "row",
            columnGap: 8,
            marginBottom: 10,
        },

        quickActionButton: {
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 9,
        },

        quickActionButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.primaryDark,
        },

        dayCard: {
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
        },

        dayCardLast: {
            borderBottomWidth: 0,
            paddingBottom: 2,
        },

        dayRowTop: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },

        dayTitleWrap: {
            flex: 1,
            paddingRight: 12,
        },

        dayTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.black,
            marginBottom: 2,
        },

        daySubtitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
        },

        checkboxWrap: {
            width: 28,
            alignItems: "center",
            justifyContent: "center",
        },

        allDayRow: {
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLORS.softBg,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        inlineRow: {
            flexDirection: "row",
            alignItems: "center",
        },

        allDayLabel: {
            marginLeft: 8,
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.black,
        },

        timeRow: {
            flexDirection: "row",
            columnGap: 10,
            marginTop: 10,
        },

        timeCard: {
            flex: 1,
            backgroundColor: COLORS.softBg,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        timeLabel: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            marginBottom: 8,
        },

        timeStepperRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },

        timeStepperButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        timeValue: {
            fontFamily: "Lexend_400Regular",
            fontSize: 15,
            color: COLORS.black,
        },

        disabledStateBox: {
            marginTop: 14,
            backgroundColor: COLORS.softBg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 14,
        },

        disabledStateText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            lineHeight: 19,
            color: COLORS.muted,
        },

        navigationRow: {
            flexDirection: "row",
            columnGap: 12,
            marginBottom: 14,
        },

        navButton: {
            flex: 1,
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 18,
            paddingVertical: 14,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },

        navButtonDisabled: {
            opacity: 0.5,
        },

        navButtonText: {
            marginLeft: 6,
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.primaryDark,
        },

        navButtonTextDisabled: {
            color: COLORS.muted,
        },

        navButtonPrimary: {
            backgroundColor: COLORS.primaryDark,
            borderColor: COLORS.primaryDark,
        },

        navButtonPrimaryDisabled: {
            opacity: 0.5,
        },

        navButtonPrimaryText: {
            marginRight: 6,
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.white,
        },

        navButtonPrimaryTextDisabled: {
            color: COLORS.white,
        },

        bottomActions: {
            marginTop: 6,
            paddingBottom: 10,
        },

        primaryButton: {
            backgroundColor: COLORS.pink,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
        },

        primaryButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.white,
        },

        secondaryButton: {
            marginTop: 12,
            backgroundColor: COLORS.softBg,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        secondaryButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.primaryDark,
        },

        confirmOverlay: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
        },

        confirmBackdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.32)",
        },

        confirmCard: {
            width: "88%",
            backgroundColor: COLORS.white,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        confirmTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 20,
            color: COLORS.black,
            marginBottom: 8,
        },

        confirmText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            lineHeight: 21,
            color: COLORS.subtext,
            marginBottom: 18,
        },

        exitButton: {
            marginTop: 12,
            backgroundColor: COLORS.pinkTint,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderWidth: 1,
            borderColor: COLORS.softPink,
        },

        exitButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.pink,
        },
        timeErrorText: {
            marginTop: 8,
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.pink,
        },

        primaryButtonDisabled: {
            opacity: 0.5,
        },

        stickyFooter: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 16,
            paddingTop: 12,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
        },

        reviewFooterRow: {
            flexDirection: "row",
            columnGap: 10,
        },

        secondaryFooterButton: {
            flex: 1,
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 18,
            paddingVertical: 15,
            alignItems: "center",
            justifyContent: "center",
        },

        secondaryFooterButtonText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 14,
            color: COLORS.primaryDark,
        },

        primaryFooterButton: {
            flex: 1,
            backgroundColor: COLORS.pink,
            borderRadius: 18,
            paddingVertical: 15,
            alignItems: "center",
            justifyContent: "center",
        },

        reviewCard: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 20,
            padding: 16,
            marginBottom: 12,
        },

        reviewBuildingTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 15,
            color: COLORS.black,
            marginBottom: 10,
        },

        reviewRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 6,
            borderTopWidth: 1,
            borderTopColor: COLORS.softBg,
        },

        reviewDay: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.black,
        },

        reviewTime: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.muted,
        },

        reviewEmptyText: {
            fontFamily: "Lexend_400Regular",
            fontSize: 13,
            color: COLORS.muted,
        },

        footerHint: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            textAlign: "center",
            marginBottom: 10,
        },

        footerNavRow: {
            flexDirection: "row",
            columnGap: 10,
            marginBottom: 10,
        },

        footerButtonContent: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 6,
        },

        footerButtonDisabled: {
            opacity: 0.5,
        },

        footerSaveButton: {
            width: "100%",
        },

        timeSelectRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },

        timePickerModal: {
            width: "88%",
            maxHeight: "70%",
            backgroundColor: COLORS.white,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
        },

        timePickerTitle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 18,
            color: COLORS.black,
            marginBottom: 14,
            textAlign: "center",
        },

        wheelPickerWrap: {
            backgroundColor: COLORS.softBg,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 18,
            marginBottom: 16,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 6,
        },

        wheelPicker: {
            width: "100%",
            height: 180,
        },
    });