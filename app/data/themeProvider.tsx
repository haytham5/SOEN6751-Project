import React, { createContext, useContext, useState } from "react";
import { Themes } from "../styles/Themes";

type Scheme = "light" | "dark";

const ThemeContext = createContext({
  theme: Themes.light,
  mode: "light" as Scheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: any) => {
  // const systemScheme = useColorScheme();
  const [mode, setMode] = useState<Scheme>("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = mode === "dark" ? Themes.dark : Themes.light;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export type ThemeType = {
  white: any; //#FFFFFF",
  black: any; //#111111",
  text: any; //#1F1F1F",
  subtext: any; //#4E4E4E",
  muted: any; //#6B7280",

  primary: any; //#56bab8",
  primaryDark: any; //#5a8c8b",
  pink: any; //#e7548b",
  lavender: any; //#9796b8",
  softPink: any; //#d6b1c3",
  cardBg: any;
  success: any;
  disabled: any; //"#B8BDC7",
  warning: any; //"#D98B1F",

  border: any; //#E7E7EC",
  softBg: any; //#F9FAFB",
  tealTint: any; //#EEF9F8",
  pinkTint: any; //#FCEAF1",
  lavenderTint: any; //#F3F1FA",

  errorBg: any; //#FFF1F4",
  errorBorder: any; //#F3C7D6",
  errorText: any; //#B42318",

  successBg: any; //#EEF9F8",
  successBorder: any; //#BFE8E6",
  successText: any; //#2F6F6D",
  iconInactive: any;
};
