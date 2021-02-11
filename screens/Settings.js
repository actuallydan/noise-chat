import React, { useEffect, useState, useGlobal } from "reactn";

import { View, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import Type from "../components/Type";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import SmallType from "../components/SmallType";

export default function Auth({ navigation }) {
  const [user, setUser] = useGlobal("user");
  const [theme, setTheme] = useGlobal("theme");
  const [color, setColor] = useState(theme.accent.replace("#", ""));

  useEffect(() => {
    if (color.length === 6 && color !== theme.accent.replace("#", "")) {
      setTheme({ ...theme, accent: "#" + color });
    }
  }, [color]);

  return (
    <Screen
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {/* <Heading size={50}>[noise]</Heading>

      <View style={styles.centerCenter}>
        <Loader />
        <Type>Connecting...</Type>
      </View> */}
      <Type style={{ fontSize: 25, marginVertical: 20 }}>Settings</Type>

      <Type style={{ fontSize: 18 }}>User Icon:</Type>
      <IconButton
        name={user.avatar}
        size={60}
        containerStyle={{ marginBottom: 20 }}
      />

      <Type style={{ fontSize: 18 }}>Theme Color:</Type>
      <Input value={color} onChangeText={setColor} />
      <SmallType>Accepts 6-digit HEX values</SmallType>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
});
