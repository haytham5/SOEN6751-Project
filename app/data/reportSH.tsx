import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const saveNewReport = async (report: Report) => {
  try {
    const reports = JSON.parse((await AsyncStorage.getItem("reports")) || "[]");
    reports.push(report);
    await AsyncStorage.setItem("reports", JSON.stringify(reports));
    console.log("Report saved successfully");
  } catch (error) {
    console.error("Error saving report:", error);
  }
};

export const getReports = async (): Promise<Report[]> => {
  try {
    const reports = JSON.parse((await AsyncStorage.getItem("reports")) || "[]");
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

export const deleteAllReports = async () => {
  try {
    await AsyncStorage.removeItem("reports");
    console.log("All reports deleted successfully");
  } catch (error) {
    console.error("Error deleting reports:", error);
  }
};
