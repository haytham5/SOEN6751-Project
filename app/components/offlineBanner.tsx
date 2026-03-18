import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setLastOnlineTime(new Date());
      } else {
        setIsOffline(true);
      }
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setIsOffline(false);
        setLastOnlineTime(new Date());
      } else {
        setIsOffline(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        You are offline. No new data since{" "}
        {lastOnlineTime
          ? lastOnlineTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "unknown"}
      </Text>
    </View>
  );
}  // ← function closes HERE

// styles live outside the function
const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#6B7280",
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "100%",
  },
  text: {
    color: "white",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    textAlign: "center",
  },
});