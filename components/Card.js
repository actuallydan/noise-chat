import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Card({
  lightMode = false,
  children,
  style = {},
  ...props
}) {
  const [theme] = useGlobal("theme");
  const bgStyle = {
    borderColor: theme.accent,
    backgroundColor: lightMode ? theme.accent : theme.dark,
  };
  return (
    <View style={[styles.view, bgStyle, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    marginVertical: 5,
    borderWidth: 3,
    borderRadius: 10,
    padding: 8,
    maxWidth: "100%",
  },
});
