import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getReports } from "../data/reportSH";
import { BUILDING_LOCATIONS, GEOFENCE_RADIUS, getDistanceMetres } from "./geofencing";

export const LOCATION_TASK = "background-location-task";

const notifiedBuildings = new Set<string>();

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) return;

  const { locations } = data;
  const { latitude, longitude } = locations[0].coords;

  // Check subscriptions
  const rawSubs = await AsyncStorage.getItem("subscriptions");
  const subscriptions = rawSubs ? JSON.parse(rawSubs) : [];
  const subscribedIds = subscriptions
    .filter((s: any) => s.isSubscribed)
    .map((s: any) => s.id);

  // Check active reports
  const reports = await getReports();

  for (const id of subscribedIds) {
    const building = BUILDING_LOCATIONS[id];
    if (!building) continue;

    const distance = getDistanceMetres(
      latitude, longitude,
      building.latitude, building.longitude
    );

    // Check if building has any active reports
    const hasReports = reports.some((r) => r.building === id);

    if (distance <= GEOFENCE_RADIUS && !notifiedBuildings.has(id) && hasReports) {
      await AsyncStorage.setItem("nearBuilding", JSON.stringify({
        buildingId: id,
        buildingName: building.name,
        time: new Date().toISOString(),
      }));
      notifiedBuildings.add(id);
    }

    if (distance > GEOFENCE_RADIUS * 2) {
      notifiedBuildings.delete(id);
      await AsyncStorage.removeItem("nearBuilding");
    }
  }
});

export async function startLocationTracking() {
  const { status: foreground } = await Location.requestForegroundPermissionsAsync();
  if (foreground !== "granted") return;

  const { status: background } = await Location.requestBackgroundPermissionsAsync();
  if (background !== "granted") return;

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 20,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "CampusAlert is running",
      notificationBody: "Monitoring nearby buildings for alerts",
    },
  });
}

export async function stopLocationTracking() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK);
}