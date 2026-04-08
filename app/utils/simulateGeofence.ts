import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReports } from "../data/reportSH";
import { getCurrentUser } from "./authStorage";
import { BUILDING_LOCATIONS } from "./geofencing";

export async function simulateNearBuilding(buildingId: string) {
  const building = BUILDING_LOCATIONS[buildingId];

  if (!building) return;

  // Check user's buildingPreferences for this building
  const user = await getCurrentUser();
  if (!user || user.isGuest) {
    console.log("No logged in user — no banner");
    return;
  }

  //console.log("User buildingPreferences:", user.buildingPreferences);
 

  const prefs: any[] = user.buildingPreferences ?? [];
  const pref = prefs.find(
    (p: any) => p.buildingId.toLowerCase() === buildingId.toLowerCase() && p.subscribed === true
  );

   //console.log("Matching pref:", pref);

  if (!pref) {
    console.log(`${buildingId} is not subscribed — no banner`);
    return;
  }

  // Check today + time window matches preference
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const todayLabel = DAY_LABELS[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayPref = (pref.dayPreferences ?? []).find(
    (d: any) => d.day === todayLabel,
  );

  if (!dayPref?.enabled) {
    console.log(`${buildingId} not enabled for ${todayLabel} — no banner`);
    return;
  }

  if (!dayPref.allDay) {
    const [startH, startM] = dayPref.startTime.split(":").map(Number);
    const [endH, endM] = dayPref.endTime.split(":").map(Number);
    const startMinutes = (startH ?? 8) * 60 + (startM ?? 0);
    const endMinutes = (endH ?? 17) * 60 + (endM ?? 0);

    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      console.log(`${buildingId} outside time window — no banner`);
      return;
    }
  }

  // Check if there are active reports for this building today
  const today = new Date().toISOString().split("T")[0];
  const reports = await getReports();

  // console.log("Today:", today);
  // console.log("Reports for building:", reports.filter(r => r.building.toLowerCase() === buildingId.toLowerCase()));

  const hasReports = reports.some(
    (r) => r.building === buildingId && r.date === today && !r.isScheduledEvent,
  );

  if (!hasReports) {
    console.log(`${buildingId} has no active reports today — no banner`);
    return;
  }

  await AsyncStorage.setItem(
    "nearBuilding",
    JSON.stringify({
      buildingId,
      buildingName: building.name,
      time: new Date().toISOString(),
      isSevere: false,
    }),
  );
}