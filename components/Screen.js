import React, { useGlobal } from "reactn";
import { View, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen({ style = {}, ...props }) {
  const insets = useSafeAreaInsets();
  const [theme] = useGlobal("theme");

  const insetStyles = {
    paddingBottom: Math.max(insets.bottom, 16),
    paddingTop: insets.top,
  };
  return (
    <View style={[styles.wrapper, insetStyles, style]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.dark} />
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingHorizontal: 10 },
});
