// import AsyncStorage from "@react-native-async-storage/async-storage";
//
// export type Report = {
//   id: string;
//   name: string;
//   description: string;
//   type: "protest" | "event" | "accessibility";
//   building: string;
//   floor: string;
//   image?: string;
//   date: string;
//   time: string;
// };
//
// export const saveNewReport = async (report: Report) => {
//   try {
//     const reports = JSON.parse((await AsyncStorage.getItem("reports")) || "[]");
//     reports.push(report);
//     await AsyncStorage.setItem("reports", JSON.stringify(reports));
//     console.log("Report saved successfully");
//   } catch (error) {
//     console.error("Error saving report:", error);
//   }
// };
//
// export const getReports = async (): Promise<Report[]> => {
//   try {
//     const reports = JSON.parse((await AsyncStorage.getItem("reports")) || "[]");
//     return reports;
//   } catch (error) {
//     console.error("Error fetching reports:", error);
//     return [];
//   }
// };
//
// export const deleteAllReports = async () => {
//   try {
//     await AsyncStorage.removeItem("reports");
//     console.log("All reports deleted successfully");
//   } catch (error) {
//     console.error("Error deleting reports:", error);
//   }
// };
import AsyncStorage from "@react-native-async-storage/async-storage";

const REPORTS_STORAGE_KEY = "reports";

export type Report = {
  id: string;
  name: string;
  description: string;
  type: "protest" | "event" | "accessibility";
  building: string;
  floor: string;
  image?: string;
  date: string;
  time: string;
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

    await AsyncStorage.setItem(
        REPORTS_STORAGE_KEY,
        JSON.stringify(reports),
    );

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

export const deleteAllReports = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REPORTS_STORAGE_KEY);
    console.log("All reports deleted successfully");
  } catch (error) {
    console.error("Error deleting reports:", error);
  }
};
