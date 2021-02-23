import React, { useState, useGlobal } from "reactn";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Input({ lightMode, ...props }) {
  const [theme] = useGlobal("theme");
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => {
    setIsFocused(true);
  };
  const onBlur = () => {
    setIsFocused(false);
  };

  const viewStyle = {
    backgroundColor: isFocused
      ? theme.accent
      : lightMode
      ? theme.accent
      : theme.dark,
    borderColor: theme.accent,
  };

  const color = isFocused ? theme.dark : lightMode ? theme.dark : theme.accent;

  const textStyle = {
    color: isFocused ? theme.dark : lightMode ? theme.dark : theme.accent,
  };

  const placeholderTextColor = lightMode
    ? theme.dark + "99"
    : theme.accent + "99";

  return (
    <TouchableOpacity accessible={false} onFocus={onFocus} onBlur={onBlur}>
      <View style={[styles.viewStyle, viewStyle]}>
        <Ionicons name="caret-forward-sharp" size={20} color={color} />

        <TextInput
          style={[styles.textStyle, textStyle]}
          color={color}
          placeholderTextColor={placeholderTextColor}
          onFocus={onFocus}
          onBlur={onBlur}
          underlineColorAndroid="transparent"
          {...props}
        />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  viewStyle: {
    marginVertical: 5,
    borderWidth: 3,
    borderRadius: 10,
    padding: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    textAlignVertical: "top",
  },
  textStyle: {
    fontFamily: "Atkinson-Hyperlegible",
    padding: 5,
    flexGrow: 1,
    fontSize: 16,
  },
});
