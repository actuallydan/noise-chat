import { createContext } from "react";

export const theme = {
  xdark: "#191825",
  dark: "#2B283E",
  light: "#4D4965",
  accent: "#FFD18D",
};

export const ThemeContext = createContext({
  xdark: "#191825",
  dark: "#2B283E",
  light: "#4D4965",
  accent: "#FFD18D",
  updateTheme: () => {},
});
