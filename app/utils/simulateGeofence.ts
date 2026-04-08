// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getReports } from "../data/reportSH";
// import { getCurrentUser } from "./authStorage";
// import { BUILDING_LOCATIONS } from "./geofencing";
//
// export async function simulateNearBuilding(buildingId: string) {
//   const building = BUILDING_LOCATIONS[buildingId];
//
//   if (!building) return;
//
//   // Check user's buildingPreferences for this building
//   const user = await getCurrentUser();
//   if (!user || user.isGuest) {
//     console.log("No logged in user — no banner");
//     return;
//   }
//
//   //console.log("User buildingPreferences:", user.buildingPreferences);
//
//
//   const prefs: any[] = user.buildingPreferences ?? [];
//   const pref = prefs.find(
//     (p: any) => p.buildingId.toLowerCase() === buildingId.toLowerCase() && p.subscribed === true
//   );
//
//    //console.log("Matching pref:", pref);
//
//   if (!pref) {
//     console.log(`${buildingId} is not subscribed — no banner`);
//     return;
//   }
//
//   // Check today + time window matches preference
//   const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const now = new Date();
//   const todayLabel = DAY_LABELS[now.getDay()];
//   const currentMinutes = now.getHours() * 60 + now.getMinutes();
//
//   const dayPref = (pref.dayPreferences ?? []).find(
//     (d: any) => d.day === todayLabel,
//   );
//
//   if (!dayPref?.enabled) {
//     console.log(`${buildingId} not enabled for ${todayLabel} — no banner`);
//     return;
//   }
//
//   if (!dayPref.allDay) {
//     const [startH, startM] = dayPref.startTime.split(":").map(Number);
//     const [endH, endM] = dayPref.endTime.split(":").map(Number);
//     const startMinutes = (startH ?? 8) * 60 + (startM ?? 0);
//     const endMinutes = (endH ?? 17) * 60 + (endM ?? 0);
//
//     if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
//       console.log(`${buildingId} outside time window — no banner`);
//       return;
//     }
//   }
//
//   // Check if there are active reports for this building today
//   const today = new Date().toISOString().split("T")[0];
//   const reports = await getReports();
//
//   // console.log("Today:", today);
//   // console.log("Reports for building:", reports.filter(r => r.building.toLowerCase() === buildingId.toLowerCase()));
//
//   const hasReports = reports.some(
//     (r) => r.building === buildingId && r.date === today && !r.isScheduledEvent,
//   );
//
//   if (!hasReports) {
//     console.log(`${buildingId} has no active reports today — no banner`);
//     return;
//   }
//
//   await AsyncStorage.setItem(
//     "nearBuilding",
//     JSON.stringify({
//       buildingId,
//       buildingName: building.name,
//       time: new Date().toISOString(),
//       isSevere: false,
//     }),
//   );
// }
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReports } from "../data/reportSH";
import { getCurrentUser } from "./authStorage";
import { BUILDING_LOCATIONS } from "./geofencing";

function normalizeBuilding(value: string | undefined | null): string {
  if (!value) return "";

  const v = value.trim().toLowerCase();

  if (v === "h" || v === "hall") return "h";
  if (v === "ev" || v === "engineering visual arts" || v === "engineering, computer science and visual arts integrated complex") return "ev";
  if (v === "fb" || v === "faubourg") return "fb";
  if (v === "lb" || v === "webster" || v === "webster library") return "lb";
  if (v === "jmsb" || v === "john molson" || v === "john molson school of business") return "jmsb";

  return v;
}

function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayLabels(date = new Date()): string[] {
  const shortLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fullLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return [shortLabels[date.getDay()], fullLabels[date.getDay()]];
}

export async function simulateNearBuilding(buildingId: string) {
  const building = BUILDING_LOCATIONS[buildingId];
  if (!building) return;

  const user = await getCurrentUser();
  if (!user || user.isGuest) {
    console.log("No logged in user — no banner");
    return;
  }

  const prefs: any[] = user.buildingPreferences ?? [];

  const pref = prefs.find(
      (p: any) =>
          normalizeBuilding(p.buildingId) === normalizeBuilding(buildingId) &&
          p.subscribed === true
  );

  if (!pref) {
    console.log(`${buildingId} is not subscribed — no banner`);
    return;
  }

  const now = new Date();
  const todayLabels = getTodayLabels(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayPref = (pref.dayPreferences ?? []).find((d: any) =>
      todayLabels.includes(d.day)
  );

  if (!dayPref?.enabled) {
    console.log(`${buildingId} not enabled for today — no banner`);
    return;
  }

  if (!dayPref.allDay) {
    const [startH, startM] = (dayPref.startTime ?? "08:00").split(":").map(Number);
    const [endH, endM] = (dayPref.endTime ?? "17:00").split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (currentMinutes < startMinutes || currentMinutes >= endMinutes) {
      console.log(`${buildingId} outside time window — no banner`);
      return;
    }
  }

  const today = getLocalDateString();
  const reports = await getReports();

  const hasReports = reports.some((r) => {
    const sameBuilding =
        normalizeBuilding(r.building) === normalizeBuilding(buildingId);

    const sameDate = r.date === today;

    const isActiveReport = !r.isScheduledEvent && !r.isResolved;

    return sameBuilding && sameDate && isActiveReport;
  });

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
      })
  );
}