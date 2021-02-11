import React, { useEffect, useState, useGlobal } from "reactn";

import { View, StyleSheet, Modal } from "react-native";
import Screen from "../components/Screen";
import Type from "../components/Type";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import SmallType from "../components/SmallType";
import { TriangleColorPicker, fromHsv } from "react-native-color-picker";
import Button from "../components/Button";
import { defaultTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "../components/BottomSheet";
export default function Auth({ navigation }) {
  const [user, setUser] = useGlobal("user");
  const [showModal, setShowModal] = useState(false);
  function goToColorSettings() {
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
  }
  return (
    <Screen
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      <Type style={{ fontSize: 25, marginVertical: 20 }}>Settings</Type>

      <Type style={{ fontSize: 18 }}>User Icon:</Type>
      <IconButton
        name={user.avatar}
        size={60}
        containerStyle={styles.marginBottom}
      />

      <Type style={{ fontSize: 18 }}>Theme Color:</Type>
      <Button onPress={goToColorSettings}>EDIT COLOR</Button>
      <Modal transparent visible={showModal}>
        <BottomSheet closeModal={closeModal}>
          <ColorSettings />
        </BottomSheet>
      </Modal>
    </Screen>
  );
}

export function ColorSettings() {
  const [theme, setTheme] = useGlobal("theme");

  const [color, setColor] = useState(theme.accent.replace("#", ""));

  useEffect(() => {
    if (color.length === 6 && color !== theme.accent.replace("#", "")) {
      saveColor("#" + color);
    }
  }, [color]);

  useEffect(() => {
    setColor(theme.accent.replace("#", ""));
  }, [theme]);

  function updateColor(color) {
    saveColor(fromHsv(color));
  }

  function setToDefault() {
    saveColor(defaultTheme.accent);
  }

  function saveColor(color) {
    setTheme({ ...theme, accent: color });
    // also save the value in async storage for the future
    AsyncStorage.setItem("accent-color", color);
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      <Type style={{ fontSize: 18 }}>Theme Color:</Type>
      <Type>Use the wheel to pick a different accent color</Type>

      <TriangleColorPicker
        onColorChange={updateColor}
        style={[{ flex: 1 }, styles.marginBottom]}
        hideControls
        color={theme.accent}
      />
      <Type>Or enter a color manually</Type>

      <Input
        defaultValue={theme.accent}
        value={color.substring(0, 6)}
        onChangeText={setColor}
      />
      <SmallType style={styles.marginBottom}>
        Accepts 6-digit HEX values
      </SmallType>
      <Button onPress={setToDefault}>RESET</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  marginBottom: {
    marginBottom: 20,
  },
});
