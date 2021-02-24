import React, { useGlobal } from "reactn";
import { Text, StyleSheet } from "react-native";

export default function Type({
  children,
  style = {},
  lightMode = false,
  h1 = false,
  h2 = false,
  ...props
}) {
  const [theme] = useGlobal("theme");
  const colorStyles = {
    color: lightMode ? theme.dark : theme.accent,
  };

  return (
    <Text
      style={[
        styles.text,
        colorStyles,
        style,
        h1 ? { fontSize: 25 } : {},
        h2
          ? {
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 10,
            }
          : {},
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Atkinson-Hyperlegible",
    marginVertical: 2,
    fontSize: 16,
  },
});
