import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReports } from "../data/reportSH";
import { BUILDING_LOCATIONS } from "./geofencing";

export async function simulateNearBuilding(buildingId: string) {
  const building = BUILDING_LOCATIONS[buildingId];
  if (!building) return;

  // Check if building is subscribed
  const rawSubs = await AsyncStorage.getItem("subscriptions");
  const subscriptions = rawSubs ? JSON.parse(rawSubs) : [];
  const isSubscribed = subscriptions.some(
    (s: any) => s.id === buildingId && s.isSubscribed
  );

  if (!isSubscribed) {
    console.log(`${buildingId} is not subscribed — no banner`);
    return;
  }

  // Check if there are active reports for this building
  const reports = await getReports();
  const hasReports = reports.some((r) => 
    r.building === buildingId && 
    !r.isResolved && 
    !r.isScheduledEvent
  );

  if (!hasReports) {
    console.log(`${buildingId} has no active reports — no banner`);
    return;
  }

  // Both checks passed — show the banner
  await AsyncStorage.setItem("nearBuilding", JSON.stringify({
    buildingId,
    buildingName: building.name,
    time: new Date().toISOString(),
  }));
}