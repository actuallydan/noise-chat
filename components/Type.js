import React, { useContext } from "react";
import { Text, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Type({
  children,
  style = {},
  lightMode = false,
  ...props
}) {
  const theme = useContext(ThemeContext);

  const colorStyles = {
    color: lightMode ? theme.dark : theme.accent,
  };
  return (
    <Text style={[styles.text, colorStyles, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Atkinson-Hyperlegible",
    marginVertical: 2,
  },
});
