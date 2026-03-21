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

export type ThemeType = {
  primary?: string; //"#006A68";
  surfaceTint?: string; //"#006A68";
  onPrimary?: string; //"#FFFFFF";
  primaryContainer?: string; //"#56BAB8";
  onPrimaryContainer?: string; //"#004746";
  secondary?: string; //"#316463";
  onSecondary?: string; //"#FFFFFF";
  secondaryContainer?: string; //"#4B7D7C";
  onSecondaryContainer?: string; //"#F3FFFE";
  tertiary?: string; //"#5C5C7B";
  onTertiary?: string; //"#FFFFFF";
  tertiaryContainer?: string; //"#9796B8";
  onTertiaryContainer?: string; //"#2E2E4B";
  error?: string; //"#AB235D";
  onError?: string; //"#FFFFFF";
  errorContainer?: string; //"#CC3F76";
  onErrorContainer?: string; //"#FFFBFF";
  background?: string; //"#F6FAF9";
  onBackground?: string; //"#181C1C";
  surface?: string; //"#F6FAF9";
  onSurface?: string; //"#181C1C";
  surfaceVariant?: string; //"#D9E5E4";
  onSurfaceVariant?: string; //"#3E4948";
  outline?: string; //"#6E7979";
  outlineVariant?: string; //"#BDC9C8";
  shadow?: string; //"#000000";
  scrim?: string; //"#000000";
  inverseSurface?: string; //"#2C3131";
  inverseOnSurface?: string; //"#EDF2F1";
  inversePrimary?: string; //"#74D6D4";
  primaryFixed?: string; //"#91F3F0";
  onPrimaryFixed?: string; //"#00201F";
  primaryFixedDim?: string; //"#74D6D4";
  onPrimaryFixedVariant?: string; //"#00504F";
  secondaryFixed?: string; //"#B8ECEB";
  onSecondaryFixed?: string; //"#002020";
  secondaryFixedDim?: string; //"#9CD0CF";
  onSecondaryFixedVariant?: string; //"#194E4E";
  tertiaryFixed?: string; //"#E2DFFF";
  onTertiaryFixed?: string; //"#181934";
  tertiaryFixedDim?: string; //"#C5C3E7";
  onTertiaryFixedVariant?: string; //"#444462";
  surfaceDim?: string; //"#D6DBDA";
  surfaceBright?: string; //"#F6FAF9";
  surfaceContainerLowest?: string; //"#FFFFFF";
  surfaceContainerLow?: string; //"#F0F4F3";
  surfaceContainer?: string; //"#EAEFEE";
  surfaceContainerHigh?: string; //"#E5E9E8";
  surfaceContainerHighest?: string; //"#DFE3E2";
  onSurface70?: string; //"#333",
  onSurface50?: string; //"#888",
  onSurface30?: string;
};
