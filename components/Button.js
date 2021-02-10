import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Button({
  lightMode,
  onPress = () => {},
  children,
  ...props
}) {
  const theme = useContext(ThemeContext);

  const viewStyle = {
    borderColor: theme.accent,
    backgroundColor: lightMode ? theme.accent : theme.dark,
  };

  const color = lightMode ? theme.dark : theme.accent;

  const textStyle = {
    color: lightMode ? theme.dark : theme.accent,
  };

  const text = children.toUpperCase();
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <View style={[styles.viewStyle, viewStyle]}>
        <Text style={[styles.textStyle, textStyle]} color={color}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    marginVertical: 5,
    borderWidth: 3,
    borderRadius: 10,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "Atkinson-Hyperlegible",
  },
});
