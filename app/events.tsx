import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import { Building2, Clock } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import AdminEventModal from "./components/AdminEventModal";
import BottomNav from "./components/bottomNav";
import OfflineBanner from "./components/offlineBanner";
import ReportFormModal from "./components/ReportFormModal";
import { deleteReport, getReports, Report } from "./data/reportSH";
import { useTheme } from "./data/themeProvider";
import { styles as importStyles } from "./styles/eventsStyles";
import { getCurrentUser } from "./utils/authStorage";
import { BUILDING_FILTER_ORDER } from "./utils/buildingOrder";

type Event = {
    id: string;
    title: string;
    acc: string;
    type: "protest" | "event" | "accessibility" | "maintenance";
    date: string;
    floor: string;
    room?: string;
    location: string;
    time: string;
    description?: string;
};

const buildingNameMap: Record<string, string> = {
    EV: "Engineering and Visual Arts",
    H: "Hall Building",
    JMSB: "JMSB",
    LB: "Main Library",
    FB: "Faubourg Building",
};

const buildingFilters = BUILDING_FILTER_ORDER;

const buildingColorMap: Record<string, string> = {
    EV: "#FF9898",
    H: "#4CAF50",
    FB: "#a683eb",
    JMSB: "#2196F3",
    LB: "#FFC107",
};


const getBuildingColor = (building: string) => {
    return buildingColorMap[building] ?? "#56bab8";
};

const formatEventType = (type: Event["type"]) => {
    switch (type) {
        case "event":
            return "Event";
        case "protest":
            return "Protest";
        case "accessibility":
            return "Accessibility";
        case "maintenance":
            return "Maintenance";
        default:
            return type;
    }
};

export default function Events() {
    const { theme } = useTheme();
    const scheme = theme;
    const styles = importStyles(scheme);

    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoading] = useState(true);

    const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [editingEvent, setEditingEvent] = useState<Report | null>(null);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);

    const [canAddEvents, setCanAddEvents] = useState(false);
    const [showAdminEventModal, setShowAdminEventModal] = useState(false);

    const [showPostedToast, setShowPostedToast] = useState(false);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setCanAddEvents(user?.role === "admin");
        });
    }, []);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
        Lexend_400Regular,
    });

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#FFFFFF");
        NavigationBar.setButtonStyleAsync("dark");
        NavigationBar.setBehaviorAsync("overlay-swipe");
    }, []);

    const loadReports = useCallback(async () => {
        try {
            const data = await getReports();
            setReports(data);
        } catch (error) {
            console.log("error loading reports", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [loadReports]),
    );

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    const openAdminEventModal = () => {
        setEditingEvent(null);
        setShowAdminEventModal(true);
    };

    const handleAdminEventPosted = useCallback(async () => {
        await loadReports();
        setShowAdminEventModal(false);
        setEditingEvent(null);
        setShowPostedToast(true);

        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = setTimeout(() => {
            setShowPostedToast(false);
        }, 1800);
    }, [loadReports]);

    const reportEventsByDate = useMemo(() => {
        const grouped: Record<string, Event[]> = {};

        reports
            .filter((report) => report.isScheduledEvent === true)
            .forEach((report) => {
                if (!grouped[report.date]) {
                    grouped[report.date] = [];
                }

                grouped[report.date].push({
                    id: `report-${report.id}`,
                    title: report.name || report.type,
                    acc: report.building,
                    type: report.type as Event["type"],
                    date: report.date,
                    floor: report.floor,
                    room: report.room,
                    location: report.building,
                    time: report.time,
                    description: report.description || "No description provided.",
                });
            });

        return grouped;
    }, [reports]);

    const filteredEventsByDate = useMemo(() => {
        const filtered: Record<string, Event[]> = {};

        Object.entries(reportEventsByDate).forEach(([date, events]) => {

                const matchingEvents =
                    selectedBuildings.length === 0
                        ? events
                        : events.filter((event) =>
                            selectedBuildings.includes(event.location),
                        );

            if (matchingEvents.length > 0) {
                filtered[date] = matchingEvents;
            }
        });

        return filtered;
    }, [reportEventsByDate, selectedBuildings]);

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        Object.keys(filteredEventsByDate).forEach((date) => {
            const uniqueBuildingDots = Array.from(
                new Map(
                    filteredEventsByDate[date].map((event) => [
                        event.location,
                        {
                            key: event.location,
                            color: getBuildingColor(event.location),
                        },
                    ]),
                ).values(),
            );

            marks[date] = {
                marked: true,
                dots: uniqueBuildingDots,
            };
        });

        marks[selectedDate] = {
            ...(marks[selectedDate] ?? {}),
            selected: true,
            selectedColor: "#56bab8",
        };

        return marks;
    }, [filteredEventsByDate, selectedDate]);

    const selectedEvents = filteredEventsByDate[selectedDate] || [];

    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        getCurrentUser().then(setCurrentUser);
    }, []);
    const handleEditEvent = () => {
        if (!selectedEvent) return;

        const rawId = selectedEvent.id.replace("report-", "");
        const fullReport = reports.find((report) => report.id === rawId);

        if (!fullReport) return;

        setSelectedEvent(null);
        setEditingEvent(fullReport);
        setShowAdminEventModal(true);
    };

    const handleDeleteEvent = () => {
        if (!selectedEvent) return;

        const rawId = selectedEvent.id.replace("report-", "");

        Alert.alert(
            "Delete event",
            "Are you sure you want to delete this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteReport(rawId);
                        setSelectedEvent(null);
                        await loadReports();
                    },
                },
            ],
        );
    };

    const simulatedOpacity = (fgHex: string, alpha = 0.2) => {
        const parseHex = (hex: string) => {
            const clean = hex.replace("#", "");
            return {
            r: parseInt(clean.substring(0, 2), 16),
            g: parseInt(clean.substring(2, 4), 16),
            b: parseInt(clean.substring(4, 6), 16),
            };
        };

        const fg = parseHex(fgHex);
        const bg = parseHex(scheme.white);

        const blend = (fgC: number, bgC: number) =>
            Math.round(alpha * fgC + (1 - alpha) * bgC);

        const toHex = (c: number) => c.toString(16).padStart(2, "0");

        return `#${toHex(blend(fg.r, bg.r))}${toHex(blend(fg.g, bg.g))}${toHex(
            blend(fg.b, bg.b)
        )}`;
    };

    if (!fontsLoaded || loadingReports) {
        return null;
    }

    return (
        <SafeAreaView style={styles.background}>
            <OfflineBanner />
            <StatusBar backgroundColor={scheme.white} barStyle="dark-content" />

            <FlatList
                data={selectedEvents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scrollableContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Your Events</Text>

                            {canAddEvents && (
                                <TouchableOpacity
                                    style={styles.adminButton}
                                    onPress={openAdminEventModal}
                                >
                                    <Text style={styles.adminButtonText}>+ Add Event</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={styles.sectionDescription}>
                            Tap a building to filter events.
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.subscriptions}
                        >
                            {buildingFilters.map((building) => {
                                const isActive = selectedBuildings.includes(building);
                                const color = getBuildingColor(building);

                                return (
                                    <TouchableOpacity
                                        key={building}
                                        activeOpacity={0.9}
                                        onPress={() =>
                                            setSelectedBuildings((prev) =>
                                                prev.includes(building)
                                                    ? prev.filter((b) => b !== building)
                                                    : [...prev, building],
                                            )
                                        }
                                        style={[
                                            styles.filterChip,
                                            {
                                                
                                                marginTop: isActive ? 1 : 0,
                                                borderColor: color,
                                                ...Platform.select({
                                                    ios: {
                                                        backgroundColor: isActive
                                                        ? `${color}20`
                                                        : scheme.white,
                                                    },
                                                    android: {
                                                        backgroundColor: isActive
                                                        ? simulatedOpacity(color, 0.2)
                                                        : scheme.white,
                                                    },
                                                }),
                                            },
                                            isActive && styles.filterChipActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.filterChipText,
                                                { color: isActive ? color : scheme.text },
                                                isActive && styles.filterChipTextActive,
                                            ]}
                                        >
                                            {building}
                                        </Text>

                                        {isActive && (
                                            <View style={[styles.filterChipBadge, { backgroundColor: color }]}>
                                                <Text style={styles.filterChipBadgeText}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.calendarCard}>
                            <Calendar
                                markingType="multi-dot"
                                markedDates={markedDates}
                                onDayPress={(day) => setSelectedDate(day.dateString)}
                                theme={{
                                    backgroundColor: scheme.white,
                                    calendarBackground: scheme.white,
                                    textSectionTitleColor: scheme.muted,
                                    selectedDayBackgroundColor: scheme.primary,
                                    selectedDayTextColor: scheme.white,
                                    todayTextColor: scheme.pink,
                                    dayTextColor: scheme.text,
                                    textDisabledColor: "#C5CED8",
                                    dotColor: scheme.primary,
                                    selectedDotColor: scheme.white,
                                    arrowColor: scheme.primaryDark,
                                    monthTextColor: scheme.text,
                                    indicatorColor: scheme.primary,
                                    textDayFontFamily: "Lexend_400Regular",
                                    textMonthFontFamily: "Lexend_400Regular",
                                    textDayHeaderFontFamily: "Lexend_400Regular",
                                    textDayFontSize: 15,
                                    textMonthFontSize: 18,
                                    textDayHeaderFontSize: 13,
                                }}
                                style={styles.calendar}
                            />
                        </View>
                    </>
                }
                renderItem={({ item }) => {

                    const typeLabel = formatEventType(item.type);
                    const eventColor = getBuildingColor(item.location);
                    const eventBackground = simulatedOpacity(eventColor, 0.12);
                    return (
                        // <View
                        //     style={[
                        //         styles.notificationCard,
                        //         {
                        //             borderLeftColor: getBuildingColor(item.location),
                        //         },
                        //     ]}
                        // >

                        <View

                            style={[
                                styles.notificationCard,
                                {
                                    borderLeftColor: eventColor,
                                    backgroundColor: eventBackground,
                                },
                            ]}
                        >
                            <View style={styles.updateCardInner}>
                                <View style={styles.updateCardLeft}>
                                    <Text style={styles.updateEventTitle}>{item.title}</Text>

                                    <View style={styles.updateTypeRow}>
                                        <Icon
                                            name={item.type === "event" ? "event" : "campaign"}
                                            size={16}
                                            color={scheme.primaryDark}
                                        />
                                        <Text style={styles.updateTypeLabel}>{typeLabel}</Text>
                                    </View>

                                    <View style={styles.updateMetaRow}>
                                        <Clock size={13} color="#5A6B80" />
                                        <Text style={styles.updateMeta}>{item.time}</Text>
                                    </View>

                                    <View style={styles.updateMetaRow}>
                                        <Building2 size={13} color="#5A6B80" />
                                        <Text style={styles.updateMeta}>
                                            {buildingNameMap[item.location] ?? item.location}
                                            {item.floor ? ` · Floor ${item.floor}` : ""}
                                            {item.room ? ` · Room ${item.room}` : ""}
                                        </Text>
                                    </View>

                                    {!!item.description && (
                                        <Text style={styles.eventPreviewText} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.chevronButton}
                                onPress={() => setSelectedEvent(item)}
                            >
                                <Icon name="expand-more" size={24} color={scheme.primaryDark} />
                            </TouchableOpacity>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No events for this date</Text>
                        <Text style={styles.emptyStateBody}>
                            Try another date or remove some building filters.
                        </Text>
                    </View>
                }
            />

            <Modal
                visible={selectedEvent !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedEvent(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setSelectedEvent(null)}
                >
                    <Pressable
                        style={styles.modalCard}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {selectedEvent && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

                                    <TouchableOpacity
                                        onPress={() => setSelectedEvent(null)}
                                        style={styles.closeButton}
                                    >
                                        <Text style={styles.closeButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.updateMetaRow}>
                                    <Building2 size={18} color="#444" />
                                    <Text style={styles.modalBuilding}>
                                        {buildingNameMap[selectedEvent.location] ??
                                            selectedEvent.location}
                                        {selectedEvent.floor ? ` — Floor ${selectedEvent.floor}` : ""}
                                        {selectedEvent.room ? ` — Room ${selectedEvent.room}` : ""}
                                    </Text>
                                </View>

                                <View style={styles.updateMetaRow}>
                                    <Icon name="event" size={16} color="#888" />
                                    <Text style={styles.modalTime}>{selectedEvent.date}</Text>
                                </View>

                                <View style={styles.updateMetaRow}>
                                    <Clock size={16} color="#888" />
                                    <Text style={styles.modalTime}>{selectedEvent.time}</Text>
                                </View>

                                <Text style={styles.modalDescription}>
                                    {selectedEvent.description || "No description provided."}
                                </Text>

                                {canAddEvents && (
                                    <View style={{ marginTop: 18, gap: 10 }}>
                                        <TouchableOpacity
                                            onPress={handleEditEvent}
                                            style={{
                                                backgroundColor: scheme.primary,
                                                paddingVertical: 12,
                                                borderRadius: 12,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: scheme.white,
                                                    fontFamily: "Lexend_400Regular",
                                                    fontSize: 14,
                                                }}
                                            >
                                                Edit Event
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleDeleteEvent}
                                            style={{
                                                backgroundColor: scheme.pink,
                                                paddingVertical: 12,
                                                borderRadius: 12,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: scheme.white,
                                                    fontFamily: "Lexend_400Regular",
                                                    fontSize: 14,
                                                }}
                                            >
                                                Delete Event
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            <ReportFormModal
                visible={isReportModalVisible}
                onClose={() => setIsReportModalVisible(false)}
                onSubmitSuccess={loadReports}
            />

            <AdminEventModal
                visible={showAdminEventModal}
                onClose={() => {
                    setShowAdminEventModal(false);
                    setEditingEvent(null);
                }}
                onSubmitSuccess={handleAdminEventPosted}
                existingEvent={editingEvent}
            />

            {showPostedToast && (
                <View
                    style={{
                        position: "absolute",
                        bottom: 92,
                        alignSelf: "center",
                        backgroundColor: "#1F2937",
                        paddingHorizontal: 18,
                        paddingVertical: 10,
                        borderRadius: 999,
                        zIndex: 20,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.12,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontFamily: "Lexend_400Regular",
                        }}
                    >
                        Posted
                    </Text>
                </View>
            )}

            <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
        </SafeAreaView>
    );
}