import React, { useState, useGlobal } from "reactn";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import IconButton from "./IconButton";

export default function BigInput({ lightMode, onPress = () => {}, ...props }) {
  const [theme] = useGlobal("theme");
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const viewStyle = {
    borderColor: theme.accent,
    backgroundColor: isFocused
      ? theme.accent
      : lightMode
      ? theme.accent
      : theme.dark,
  };

  const textStyle = {
    color: isFocused ? theme.dark : lightMode ? theme.dark : theme.accent,
  };
  const placeholderTextColor = lightMode
    ? theme.dark + "99"
    : theme.accent + "99";

  return (
    <TouchableOpacity accessible={false} onFocus={onFocus} onBlur={onBlur}>
      <View style={[styles.viewStyle, viewStyle]}>
        <TextInput
          style={[styles.textStyle, textStyle]}
          placeholderTextColor={placeholderTextColor}
          onFocus={onFocus}
          onBlur={onBlur}
          multiline={true}
          numberOfLines={4}
          underlineColorAndroid="transparent"
          {...props}
        />
        <IconButton
          name="chevron-forward-sharp"
          size={25}
          onPress={onPress}
          lightMode={props.value}
          disabled={!props.value}
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
    alignItems: "flex-start",
  },
  textStyle: {
    fontFamily: "Atkinson-Hyperlegible",
    padding: 5,
    flex: 1,
    textAlignVertical: "top",
    height: "100%",
    marginRight: 5,
    maxHeight: 120,
    alignItems: "flex-start",
    fontSize: 16,
  },
});
