import { Report } from "./reportSH";

export type NotificationItem = {
    id: string;
    buildingId: string;
    buildingName: string;
    eventName: string;
    description: string;
    timeLabel: string;
    timeAgo: string;
    minutesSinceMidnight: number;
    tone: "red" | "green";
};

export type SubscriptionItem = {
    id: string;
    label: string;
    tone: "red" | "green";
    isSubscribed: boolean;
};

export const initialSubscriptions: SubscriptionItem[] = [
    { id: "EV", label: "EV", tone: "red", isSubscribed: true },
    { id: "LB", label: "LB", tone: "green", isSubscribed: true },
    { id: "H", label: "H", tone: "red", isSubscribed: false },
    { id: "JM", label: "JM", tone: "green", isSubscribed: false },
    { id: "FB", label: "FB", tone: "red", isSubscribed: false },
];

export const notifications: NotificationItem[] = [
    {
        id: "ev1",
        buildingId: "EV",
        buildingName: "Engineering and Visual Arts",
        eventName: "Protest spotted",
        description:
            "A protest has been reported near the main entrance. Expect delays and heavier pedestrian traffic.",
        timeLabel: "11:00am",
        timeAgo: "about 1 hour ago",
        minutesSinceMidnight: 11 * 60,
        tone: "red",
    },
    {
        id: "lb1",
        buildingId: "LB",
        buildingName: "Main Library",
        eventName: "Elevators out of order",
        description:
            "The elevators are currently unavailable. Please use the stairs or an alternate accessible route.",
        timeLabel: "12:00pm",
        timeAgo: "about 20 minutes ago",
        minutesSinceMidnight: 12 * 60,
        tone: "green",
    },
    {
        id: "h1",
        buildingId: "H",
        buildingName: "Hall Building",
        eventName: "Student Bake Sale",
        description:
            "Multiple clubs will be hosting a bake sale. Expect delays and heavier pedestrian traffic.",
        timeLabel: "11:00am",
        timeAgo: "about 1 hour ago",
        minutesSinceMidnight: 11 * 60,
        tone: "red",
    },
];

// ============================================
// TEST DATA — remove before production
// Edit values here to test different scenarios
// ============================================
export const testReports: Report[] = [
  {
    id: "test-concordian-1",
    name: "Crowded hallway near elevators",
    description: "Very heavy foot traffic near the main elevators on floor 2.",
    type: "accessibility",
    accessibilitySubtype: "foot_traffic",
    building: "EV",
    floor: "2",
    date: new Date().toISOString().split("T")[0],
    time: "09:30 AM",
    submittedBy: "concordian",
    isScheduledEvent: false,
    isSevere: false,
    isVerifiedBySecurity: true,
    upvotedBy: ["user1@test.com", "user2@test.com"],
    isResolved: false,
  },
  {
    id: "test-concordian-2",
    name: "Elevator out of service",
    description: "Elevator B is completely out of service.",
    type: "accessibility",
    accessibilitySubtype: "elevator",
    building: "LB",
    floor: "1",
    date: new Date().toISOString().split("T")[0],
    time: "11:00 AM",
    submittedBy: "concordian",
    isScheduledEvent: false,
    isSevere: false,
    isVerifiedBySecurity: false,
    upvotedBy: [],
    isResolved: true,
    resolvedBy: "user3@test.com",
  },
  {
    id: "test-security-1",
    name: "Protest near main entrance",
    description: "Large group gathering outside the main entrance. Expect delays.",
    type: "protest",
    building: "EV",
    floor: "1",
    date: new Date().toISOString().split("T")[0],
    time: "10:15 AM",
    submittedBy: "security",
    isScheduledEvent: false,
    isSevere: false,
    isVerifiedBySecurity: true,
    upvotedBy: ["user1@test.com"],
    isResolved: false,
  },
  {
    id: "test-security-2",
    name: "Escalator blocked",
    description: "Escalator on floor 3 is blocked due to maintenance.",
    type: "accessibility",
    accessibilitySubtype: "escalator",
    building: "H",
    floor: "3",
    date: new Date().toISOString().split("T")[0],
    time: "08:45 AM",
    submittedBy: "security",
    isScheduledEvent: false,
    isSevere: true,
    isVerifiedBySecurity: true,
    upvotedBy: ["user1@test.com", "user2@test.com", "user3@test.com"],
    isResolved: false,
  },
  {
    id: "test-admin-1",
    name: "Career Fair",
    description: "Annual career fair with 50+ employers.",
    type: "event",
    building: "EV",
    floor: "1",
    date: "2026-03-25",
    time: "09:00 AM",
    submittedBy: "admin",
    isScheduledEvent: true,
    isSevere: false,
    isVerifiedBySecurity: false,
    upvotedBy: [],
    isResolved: false,
    eventStartDate: "2026-03-25T09:00:00.000Z",
    eventEndDate: "2026-03-25T17:00:00.000Z",
  },
];