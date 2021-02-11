import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../utils/theme";

export default function IconButton({
  lightMode,
  name,
  size = 30,
  onPress = () => {},
  border = true,
  round = false,
  containerStyle = {},
  ...props
}) {
  const [theme] = useGlobal("theme");
  const touchStyle = {
    width: size + 2,
    height: size + 2,
    ...containerStyle,
  };
  const viewStyle = {
    backgroundColor: lightMode ? theme.accent : theme.dark,
    borderColor: border ? theme.accent : "transparent",
    width: size,
    height: size,
    borderRadius: round ? 9999 : 10,
  };
  const color = lightMode ? theme.dark : theme.accent;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.touchStyle, touchStyle]}>
      <View style={[styles.viewStyle, viewStyle]}>
        <Ionicons name={name} size={size - 10} color={color} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchStyle: {
    marginVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  viewStyle: {
    borderWidth: 3,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
