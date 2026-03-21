import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onBannerPress?: (buildingId: string) => void;
};

export default function NearBuildingBanner({ onBannerPress }: Props) {
  const [nearBuilding, setNearBuilding] = useState<{
    buildingId: string;
    buildingName: string;
    time: string;
    isSevere?: boolean;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const raw = await AsyncStorage.getItem("nearBuilding");
        if (raw) {
          setNearBuilding(JSON.parse(raw));
        } else {
          setNearBuilding(null);
        }
      } catch (e) {
        console.log("Error checking near building:", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!nearBuilding) return null;

  return (
    <View style={[styles.banner, nearBuilding.isSevere && styles.bannerSevere]}>
      <TouchableOpacity
        style={styles.textContainer}
        onPress={() => onBannerPress?.(nearBuilding.buildingId)}
      >
        <Text style={styles.text}>
          {nearBuilding.isSevere
            ? `Severe alert at ${nearBuilding.buildingName} — marked by security`
            : `You are near ${nearBuilding.buildingName} which has active alerts`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => {
        await AsyncStorage.removeItem("nearBuilding");
        setNearBuilding(null);
      }}>
        <Text style={styles.dismiss}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#E98A8A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
  },
  dismiss: {
    color: "white",
    fontSize: 18,
    paddingLeft: 10,
  },

  bannerSevere: {
    backgroundColor: "#D9534F",  // red instead of the default colour
  },
});