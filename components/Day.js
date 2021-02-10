import React from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";
import Type from "./Type";

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
        <Type style={textStyle} {...textProps}>
          {dayjs(text).format("ll")}
        </Type>
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
});
