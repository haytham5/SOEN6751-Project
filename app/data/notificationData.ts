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