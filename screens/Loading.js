import React from "react";
import { Image, View, StyleSheet } from "react-native";
import Loader from "../components/Loader";

export default function Loading() {
  return (
    <View style={styles.wrapper}>
      <Loader />
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
