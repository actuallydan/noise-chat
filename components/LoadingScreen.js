import React from "reactn";

import { View, StyleSheet, Image } from "react-native";

import Type from "../components/Type";
import Loader from "../components/Loader";
import Screen from "../components/Screen";

export default function LoadingScreen({ loadingText = "Loading..." }) {
  return (
    <Screen
      style={{ flex: 1, justifyContent: "space-around", alignItems: "center" }}
    >
      <Image
        source={require("../assets/noise-logo.png")}
        style={styles.image}
        resizeMethod={"resize"}
      />

      <View style={styles.centerCenter}>
        <Loader />
        <Type>{loadingText}</Type>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 194,
  },
});
