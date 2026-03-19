import AsyncStorage from "@react-native-async-storage/async-storage";

const REPORTS_STORAGE_KEY = "reports";

export type AccessibilitySubtype =
  | "escalator"
  | "elevator"
  | "ramp"
  | "foot_traffic";

export type ReportType = "protest" | "event" | "accessibility";

export type UserRole = "security" | "concordian" | "admin";

export type Report = {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  building: string;
  floor: string;
  image?: string;
  date: string;
  time: string;

  // Accessibility subtype — only populated when type === "accessibility"
  accessibilitySubtype?: AccessibilitySubtype;

  // Who submitted the report
  submittedBy: UserRole;

  // Admin-only scheduled future events
  isScheduledEvent: boolean;

  // Security-only
  isSevere: boolean;
  isVerifiedBySecurity: boolean;

  // Upvotes — stores IDs of users who upvoted
  upvotedBy: string[];

  // Resolved flag — anyone can mark, doesn't remove the report
  isResolved: boolean;
  resolvedBy?: string;   // user ID or name of who marked it resolved
};

const parseReports = async (): Promise<Report[]> => {
  try {
    const raw = await AsyncStorage.getItem(REPORTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error parsing reports:", error);
    return [];
  }
};

export const saveNewReport = async (report: Report): Promise<void> => {
  try {
    const reports = await parseReports();
    reports.push(report);
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    console.log("Report saved successfully");
  } catch (error) {
    console.error("Error saving report:", error);
  }
};

export const getReports = async (): Promise<Report[]> => {
  try {
    const reports = await parseReports();
    return reports.sort((a, b) => {
      const aDateTime = new Date(`${a.date} ${a.time}`).getTime();
      const bDateTime = new Date(`${b.date} ${b.time}`).getTime();
      return bDateTime - aDateTime;
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

export const getReportsByBuilding = async (
  buildingId: string,
): Promise<Report[]> => {
  const reports = await getReports();
  return reports.filter((report) => report.building === buildingId);
};

// Returns only admin-created scheduled future events (for calendar)
export const getScheduledEvents = async (): Promise<Report[]> => {
  const reports = await getReports();
  return reports.filter((r) => r.isScheduledEvent);
};

// Returns only non-scheduled reports (for notifications/map)
export const getActiveReports = async (): Promise<Report[]> => {
  const reports = await getReports();
  return reports.filter((r) => !r.isScheduledEvent);
};

// Upvote a report — userId must not be the original reporter
export const upvoteReport = async (
  reportId: string,
  userId: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      if (r.name === userId) return r; // can't upvote own report
      if (r.upvotedBy.includes(userId)) return r; // already upvoted
      return { ...r, upvotedBy: [...r.upvotedBy, userId] };
    });
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error upvoting report:", error);
  }
};

// Mark a report as resolved
export const markReportResolved = async (
  reportId: string,
  resolvedBy: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const updated = reports.map((r) =>
      r.id === reportId
        ? { ...r, isResolved: true, resolvedBy }
        : r
    );
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error marking report resolved:", error);
  }
};

// Mark a report as severe — security only (enforce in UI)
export const markReportSevere = async (
  reportId: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const updated = reports.map((r) =>
      r.id === reportId ? { ...r, isSevere: true } : r
    );
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error marking report severe:", error);
  }
};

export const deleteAllReports = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REPORTS_STORAGE_KEY);
    console.log("All reports deleted successfully");
  } catch (error) {
    console.error("Error deleting reports:", error);
  }
};
