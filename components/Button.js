import React, { useGlobal } from "reactn";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import IconButton from "../components/IconButton";

export default function Button({
  lightMode,
  onPress = () => {},
  withIcon = null,
  uppercase = true,
  children,
  ...props
}) {
  const [theme] = useGlobal("theme");
  const viewStyle = {
    borderColor: theme.accent,
    backgroundColor: lightMode ? theme.accent : theme.dark,
  };

  const color = lightMode ? theme.dark : theme.accent;

  const textStyle = {
    color: lightMode ? theme.dark : theme.accent,
  };

  const text = uppercase ? children.toUpperCase() : children;
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <View style={[styles.viewStyle, viewStyle]}>
        {withIcon && (
          <IconButton
            lightMode={lightMode}
            name={withIcon}
            size={35}
            border={false}
          />
        )}
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "Atkinson-Hyperlegible",
  },
});
