import React, { useGlobal } from "reactn";
import { Text, StyleSheet } from "react-native";

export default function Type({
  children,
  style = {},
  lightMode = false,
  ...props
}) {
  const [theme] = useGlobal("theme");
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
    fontSize: 10,
  },
});
