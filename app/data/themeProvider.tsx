import AsyncStorage from "@react-native-async-storage/async-storage";

export type Scheme = {
  type: "light" | "dark";
};

export const switchTheme = async () => {
  try {
    const themeSetting = JSON.parse(
      (await AsyncStorage.getItem("colorScheme")) || "light",
    );
    const newScheme = themeSetting === "light" ? "dark" : "light";
    await AsyncStorage.setItem("colorScheme", JSON.stringify(newScheme));
    console.log("Theme switched successfully");
  } catch (error) {
    console.error("Error switching theme:", error);
  }
};

export const getTheme = async (): Promise<Scheme> => {
  try {
    const themeSetting = JSON.parse(
      (await AsyncStorage.getItem("colorScheme")) || "light",
    );
    return { type: themeSetting };
  } catch (error) {
    console.error("Error getting theme:", error);
    return { type: "light" };
  }
};
