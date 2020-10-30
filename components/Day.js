import React from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";

export default function Day({
  text = "",
  containerStyle = {},
  wrapperStyle = {},
  textStyle = {},
  textProps = {},
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]} {...textProps}>
          {dayjs(text).format("ll")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: "transparent",
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
});
