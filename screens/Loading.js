import React from "react";
import { Image, View, StyleSheet } from "react-native";

export default function Loading() {
  const src = require("../assets/favicon.png");

  return (
    <View style={styles.wrapper}>
      <Image source={src} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
