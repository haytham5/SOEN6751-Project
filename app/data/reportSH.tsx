import AsyncStorage from "@react-native-async-storage/async-storage";

const REPORTS_STORAGE_KEY = "reports";

export type TimelineEvent = {
  action:
    | "reported"
    | "upvoted"
    | "verified"
    | "unverified"
    | "resolved"
    | "severe"
    | "unsevere";
  by: string;
  time: string;
};

export type AccessibilitySubtype =
  | "escalator"
  | "elevator"
  | "ramp"
  | "foot_traffic"
  | "other";

export type ReportType = "protest" | "event" | "accessibility";

export type UserRole = "security" | "concordian" | "admin";

export type Report = {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  building: string;
  floor: string;
  room?: string;
  image?: string;
  date: string;
  time: string;
  accessibilitySubtype?: AccessibilitySubtype;
  submittedBy: UserRole;
  isScheduledEvent: boolean;
  isSevere: boolean;
  severeBy?: string[];
  upvotedBy: string[];
  isResolved: boolean;
  resolvedBy?: string[];
  isVerifiedBySecurity: boolean;
  verifiedBy?: string[];
  eventStartDate?: string;
  eventEndDate?: string;
  timeline: TimelineEvent[];
};

export type NewReportInput = Omit<Report, "isVerifiedBySecurity" | "timeline">;

const parseReports = async (): Promise<Report[]> => {
  try {
    const raw = await AsyncStorage.getItem(REPORTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error parsing reports:", error);
    return [];
  }
};

export const saveNewReport = async (report: NewReportInput): Promise<void> => {
  try {
    const reports = await parseReports();

    const reportWithDefaults: Report = {
      ...report,
      isVerifiedBySecurity: report.submittedBy === "security",

      verifiedBy: [], // ← always empty at start
      severeBy: [], // ← always empty at start

      timeline: [
        {
          action: "reported",
          by: report.submittedBy,
          time: report.time,
        },
      ],
    };

    reports.push(reportWithDefaults);
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error("Error saving report:", error);
  }
};

export const verifyReport = async (
  reportId: string,
  verifiedBy: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;

      const hasVerified = (r.verifiedBy ?? []).includes(verifiedBy);

      if (hasVerified) {
        const newVerifiedBy = (r.verifiedBy ?? []).filter(
          (id) => id !== verifiedBy,
        );

        return {
          ...r,
          verifiedBy: newVerifiedBy,
          isVerifiedBySecurity: newVerifiedBy.length > 0,
          timeline: [
            ...(r.timeline ?? []),
            {
              action: "unverified" as const,
              by: verifiedBy,
              time: now,
            },
          ],
        };
      }

      return {
        ...r,
        verifiedBy: [...(r.verifiedBy ?? []), verifiedBy],
        isVerifiedBySecurity: true,
        timeline: [
          ...(r.timeline ?? []),
          {
            action: "verified" as const,
            by: verifiedBy,
            time: now,
          },
        ],
      };
    });

    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error verifying report:", error);
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

export const getScheduledEvents = async (): Promise<Report[]> => {
  const reports = await getReports();
  return reports.filter((r) => r.isScheduledEvent);
};

export const getActiveReports = async (): Promise<Report[]> => {
  const reports = await getReports();
  return reports.filter((r) => !r.isScheduledEvent);
};

export const upvoteReport = async (
  reportId: string,
  userId: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;

      const hasUpvoted = (r.upvotedBy ?? []).includes(userId);

      if (hasUpvoted) {
        return {
          ...r,
          upvotedBy: (r.upvotedBy ?? []).filter((id) => id !== userId),
          timeline: (r.timeline ?? []).filter(
            (e) => !(e.action === "upvoted" && e.by === userId),
          ),
        };
      }

      return {
        ...r,
        upvotedBy: [...(r.upvotedBy ?? []), userId],
        timeline: [
          ...(r.timeline ?? []),
          {
            action: "upvoted" as const,
            by: userId,
            time: now,
          },
        ],
      };
    });

    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error upvoting report:", error);
  }
};

export const markReportResolved = async (
  reportId: string,
  resolvedBy: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;

      const hasResolved = (r.resolvedBy ?? []).includes(resolvedBy);

      if (hasResolved) {
        const newResolvedBy = (r.resolvedBy ?? []).filter(
          (id) => id !== resolvedBy,
        );

        return {
          ...r,
          resolvedBy: newResolvedBy,
          isResolved: newResolvedBy.length > 0,
          timeline: (r.timeline ?? []).filter(
            (e) => !(e.action === "resolved" && e.by === resolvedBy),
          ),
        };
      }

      return {
        ...r,
        resolvedBy: [...(r.resolvedBy ?? []), resolvedBy],
        isResolved: true,
        timeline: [
          ...(r.timeline ?? []),
          {
            action: "resolved" as const,
            by: resolvedBy,
            time: now,
          },
        ],
      };
    });

    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error marking report resolved:", error);
  }
};

export const markReportSevere = async (
  reportId: string,
  markedBy: string,
): Promise<void> => {
  try {
    const reports = await parseReports();
    const report = reports.find((r) => r.id === reportId);

    if (!report) {
      console.log("markReportSevere: report not found", reportId);
      return;
    }

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;

      const hasMarkedSevere = (r.severeBy ?? []).includes(markedBy);

      if (hasMarkedSevere) {
        const newSevereBy = (r.severeBy ?? []).filter((id) => id !== markedBy);

        return {
          ...r,
          severeBy: newSevereBy,
          isSevere: newSevereBy.length > 0,
          timeline: [
            ...(r.timeline ?? []),
            {
              action: "unsevere" as const,
              by: markedBy,
              time: now,
            },
          ],
        };
      }

      return {
        ...r,
        severeBy: [...(r.severeBy ?? []), markedBy],
        isSevere: true,
        timeline: [
          ...(r.timeline ?? []),
          {
            action: "severe" as const,
            by: markedBy,
            time: now,
          },
        ],
      };
    });

    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));

    const updatedReport = updated.find((r) => r.id === reportId);

    if (updatedReport?.isSevere) {
      const nearBuildingData = {
        buildingId: report.building,
        buildingName: report.building,
        time: now,
        isSevere: true,
      };

      await AsyncStorage.setItem(
        "nearBuilding",
        JSON.stringify(nearBuildingData),
      );
    }
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
