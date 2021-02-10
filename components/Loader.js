import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Loader() {
  const theme = useContext(ThemeContext);

  return (
    <View style={styles.viewStyle}>
      <ActivityIndicator color={theme.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: { justifyContent: "center", alignItems: "center", width: "100%" },
});
