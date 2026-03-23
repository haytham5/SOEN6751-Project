import { Lexend_400Regular } from "@expo-google-fonts/lexend";
import { Pacifico_400Regular, useFonts } from "@expo-google-fonts/pacifico";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import { Building2, Clock } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Modal,
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
import { getReports, Report } from "./data/reportSH";
import { styles } from "./styles/eventsStyles";
import { getCurrentUser } from "./utils/authStorage";

type Event = {
    id: string;
    title: string;
    acc: string;
    type: "protest" | "event" | "accessibility" | "maintenance";
    date: string;
    floor: string;
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

const typeDotColorMap: Record<string, string> = {
    protest: "#e7548b",
    event: "#56bab8",
    accessibility: "#56bab8",
    maintenance: "#9796b8",
};

const buildingColorMap: Record<string, string> = {
    EV: "#FF9898",
    H: "#4CAF50",
    FB: "#a683eb",
    JMSB: "#2196F3",
    JM: "#2196F3",
    LB: "#FFC107",
};

export default function Events() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoading] = useState(true);

    const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminEventModal, setShowAdminEventModal] = useState(false);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setIsAdmin(user?.role === "admin");
        });
    }, []);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
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
        }, [loadReports])
    );

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
                    type: report.type,
                    date: report.date,
                    floor: report.floor,
                    location: report.building,
                    time: report.time,
                    description: report.description || "No description provided.",
                });
            });

        return grouped;
    }, [reports]);

    const allEvents = reportEventsByDate;

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        Object.keys(allEvents).forEach((date) => {
            marks[date] = {
                marked: true,
                dots: allEvents[date].map((event) => ({
                    key: event.id,
                    color: typeDotColorMap[event.type] || "#56bab8",
                })),
            };
        });

        if (selectedDate) {
            marks[selectedDate] = {
                ...marks[selectedDate],
                selected: true,
                selectedColor: "#56bab8",
            };
        }

        return marks;
    }, [allEvents, selectedDate]);

    const selectedEvents = (allEvents[selectedDate] || []).filter((event) =>
        selectedBuildings.length > 0
            ? selectedBuildings.some(b => 
                b === event.location || 
                (b === "JM" && event.location === "JMSB")  
            )
            : true
    );

    const buildingFilters = ["EV", "LB", "H", "JM", "FB"];

    if (!fontsLoaded || loadingReports) {
        return null;
    }

    return (
        <SafeAreaView style={styles.background}>
            <OfflineBanner />
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <FlatList
                data={selectedEvents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scrollableContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Your Events</Text>
                            {isAdmin && (
                                <TouchableOpacity
                                    style={styles.adminButton}
                                    onPress={() => setShowAdminEventModal(true)}
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

                                return (
                                    <TouchableOpacity
                                        key={building}
                                        activeOpacity={0.9}
                                        onPress={() =>
                                            setSelectedBuildings((prev) =>
                                                prev.includes(building)
                                                    ? prev.filter((b) => b !== building)
                                                    : [...prev, building]
                                            )
                                        }
                                    >
                                        <View
                                        style={[
                                            styles.subCard,
                                            {
                                            backgroundColor: isActive ? buildingColorMap[building] : "transparent",
                                            borderWidth: 2,
                                            borderColor: buildingColorMap[building] ?? "#9c9c9c",
                                            },
                                            isActive ? styles.subCardActive : styles.subCardInactive,
                                        ]}
                                        >
                                            <Text style={styles.subBody}>{building}</Text>
                                            <Text style={styles.subLabel}>
                                                {isActive ? "On" : "Off"}
                                            </Text>
                                        </View>
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
                                    backgroundColor: "#FFFFFF",
                                    calendarBackground: "#FFFFFF",
                                    textSectionTitleColor: "#6B7280",
                                    selectedDayBackgroundColor: "#56bab8",
                                    selectedDayTextColor: "#FFFFFF",
                                    todayTextColor: "#e7548b",
                                    dayTextColor: "#1F1F1F",
                                    textDisabledColor: "#C5CED8",
                                    dotColor: "#56bab8",
                                    selectedDotColor: "#FFFFFF",
                                    arrowColor: "#5a8c8b",
                                    monthTextColor: "#1F1F1F",
                                    indicatorColor: "#56bab8",
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
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.notificationCard,
                            { borderLeftColor: buildingColorMap[item.location] ?? "#E7E7EC" },
                        ]}
                    >


                        <View style={styles.updateCardInner}>
                            <View style={styles.updateCardLeft}>
                                <Text style={styles.updateEventTitle}>{item.title}</Text>

                                <View style={styles.updateTypeRow}>
                                    <Icon name="event" size={16} color="#5a8c8b" />
                                    <Text style={styles.updateTypeLabel}>{item.type}</Text>
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
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.chevronButton}
                            onPress={() => setSelectedEvent(item)}
                        >
                            <Icon name="expand-more" size={24} color="#5a8c8b" />
                        </TouchableOpacity>
                    </View>
                )}
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
                                        {buildingNameMap[selectedEvent.location] ?? selectedEvent.location}
                                        {selectedEvent.floor ? ` — Floor ${selectedEvent.floor}` : ""}
                                    </Text>
                                    </View>

                                    <View style={styles.updateMetaRow}>
                                        <Icon name="event" size={16} color="#888" />
                                    <Text style={styles.modalTime}>
                                        {selectedEvent.date}
                                    </Text>
                                    </View>

                                    <View style={styles.updateMetaRow}>
                                    <Clock size={16} color="#888" />
                                    <Text style={styles.modalTime}>
                                        {selectedEvent.time}
                                    </Text>
                                    </View>

                                <Text style={styles.modalDescription}>
                                    {selectedEvent.description || "No description provided."}
                                </Text>
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
                onClose={() => setShowAdminEventModal(false)}
                onSubmitSuccess={loadReports}
            />

            <BottomNav onPressAdd={() => setIsReportModalVisible(true)} />
        </SafeAreaView>
    );
}