import React, { useContext } from "react";
import { Text, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Header({
  children,
  size = 30,
  lightMode = false,
  ...props
}) {
  const theme = useContext(ThemeContext);

  const style = {
    fontSize: size,
    color: lightMode ? theme.dark : theme.accent,
  };
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Lora",
    marginVertical: 5,
  },
});
