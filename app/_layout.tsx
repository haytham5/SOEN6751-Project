import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { testReports } from "./data/notificationData";
import { getReports } from "./data/reportSH";
import { ThemeProvider } from "./data/themeProvider";
import { addUser, getUsers } from "./utils/authStorage";
import { startLocationTracking } from "./utils/backgroundLocation";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();

    const seedAdminUser = async () => {
      const users = await getUsers();
      const adminExists = false;
      if (!adminExists) {
        await addUser({
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          idNumber: "000000",
          phone: "",
          email: "admin@concordia.ca",
          password: "admin123",
        });
      }
    };

    const seedSecurityUser = async () => {
      const users = await getUsers();
      const securityExists = users.some(
        (u) => u.email === "security@concordia.ca",
      );
      if (!securityExists) {
        await addUser({
          firstName: "Security",
          lastName: "Officer",
          role: "security",
          idNumber: "111111",
          phone: "",
          email: "security@concordia.ca",
          password: "security123",
        });
      }
    };

    const seedTestReports = async () => {
      const existing = await getReports();
      const realReports = existing.filter((r) => !r.id.startsWith("test-"));
      const today = new Date().toISOString().split("T")[0];

      const merged = [
        ...realReports,
        ...testReports.map((r) => ({
          ...r,
          date: today, // ← inject today's date here
          isVerifiedBySecurity: r.isVerifiedBySecurity ?? r.submittedBy === "security",
          verifiedBy: r.verifiedBy ?? [],
          severeBy: r.severeBy ?? [],
        })),
      ];

      await AsyncStorage.setItem("reports", JSON.stringify(merged));

      const after = await getReports();
      console.log("reports after seeding:", after.length);
      console.log("dates:", after.map((r) => r.date));
    };

    const setup = async () => {
      await seedAdminUser();
      await seedSecurityUser();
      await seedTestReports();
      await AsyncStorage.setItem("seeded", "true");
    };

    setup();
    startLocationTracking();
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </ThemeProvider>
  );
}
