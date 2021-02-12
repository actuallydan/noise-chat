import React, { useEffect, useState, useGlobal, useCallback } from "reactn";

import { View, StyleSheet, Modal, Dimensions, ScrollView } from "react-native";
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
import { Portal } from "@gorhom/portal";
import { userIconList } from "../utils/user-icon-list";
import firebase from "../utils/firebase";

export default function Settings({ navigation }) {
  const [user, setUser] = useGlobal("user");
  const [showColorModal, setShowColorModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);

  function goToColorSettings() {
    setShowColorModal(true);
  }

  function closeColorModal() {
    setShowColorModal(false);
  }

  function goToIconSettings() {
    setShowIconModal(true);
  }

  function closeIconModal() {
    setShowIconModal(false);
  }

  return (
    <Screen style={styles.wrapper}>
      <Type style={{ fontSize: 25, marginVertical: 20 }}>Settings</Type>

      <Type style={{ fontSize: 18 }}>User Icon:</Type>
      <IconButton
        name={user.avatar}
        size={60}
        containerStyle={styles.marginBottom}
        onPress={goToIconSettings}
      />
      <Portal>
        <Modal transparent visible={showIconModal}>
          <BottomSheet closeModal={closeIconModal}>
            <IconSettings closeIconModal={closeIconModal} />
          </BottomSheet>
        </Modal>
      </Portal>
      <Type style={{ fontSize: 18 }}>Theme Color:</Type>
      <Button onPress={goToColorSettings}>EDIT COLOR</Button>
      <Portal>
        <Modal transparent visible={showColorModal}>
          <BottomSheet closeModal={closeColorModal}>
            <ColorSettings />
          </BottomSheet>
        </Modal>
      </Portal>
    </Screen>
  );
}

export function ColorSettings() {
  const [theme, setTheme] = useGlobal("theme");

  const [color, setColor] = useState(theme.accent.replace("#", ""));
  const user = firebase.auth().currentUser;

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
    // user.updateProfile()
    // also save the value in async storage for the future
    AsyncStorage.setItem("accent-color", color);
  }
  return (
    <View style={styles.wrapper}>
      <Type style={{ fontSize: 18 }}>Theme Color:</Type>
      <Type>Use the wheel to pick a different accent color</Type>

      <TriangleColorPicker
        onColorChange={updateColor}
        style={[{ flex: 1 }, styles.marginBottom]}
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

export function IconSettings({ closeIconModal }) {
  const [user, setUser] = useGlobal("user");

  const updateIcon = useCallback((icon) => {
    setUser({ ...user, avatar: icon });
    closeIconModal();
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.containerStyle}>
        {userIconList.map((icon) => (
          <IconButtonWrapped
            icon={icon}
            onPress={updateIcon}
            isSelected={icon === user.avatar}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const IconButtonWrapped = ({ onPress, icon, isSelected }) => {
  const _handlePress = () => {
    onPress(icon);
  };
  return (
    <IconButton
      name={icon}
      size={Dimensions.get("window").width / 8}
      onPress={_handlePress}
      lightMode={isSelected}
      border={false}
    />
  );
};

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  marginBottom: {
    marginBottom: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  containerStyle: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
