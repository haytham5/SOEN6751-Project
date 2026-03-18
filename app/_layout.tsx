import { Stack } from "expo-router";
import { useEffect } from "react";
import { startLocationTracking } from "./utils/backgroundLocation";

export default function RootLayout() {
  useEffect(() => {
    startLocationTracking();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}