import React, {
  useEffect,
  useState,
  useGlobal,
  useCallback,
  useRef,
  useContext,
} from "reactn";

import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import Screen from "../components/Screen";
import Type from "../components/Type";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import SmallType from "../components/SmallType";
import Button from "../components/Button";
import { defaultTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomContext } from "../components/BottomSheet";
import { Portal } from "@gorhom/portal";
import { userIconList } from "../utils/user-icon-list";
import firebase from "../utils/firebase";
import Header from "../components/Header";
// import { TriangleColorPicker, fromHsv } from "react-native-color-picker";
import ColorPicker from "react-native-wheel-color-picker";

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

  function goBack() {
    navigation.goBack();
  }

  return (
    <Screen style={styles.wrapper}>
      <Header onPress={goBack} topIcon={"chevron-back-sharp"} />
      <View style={[styles.wrapper, styles.paddingForHeader]}>
        <Type style={{ fontSize: 25, marginBottom: 20, marginTop: 35 }}>
          Settings
        </Type>

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
      </View>
    </Screen>
  );
}

export function ColorSettings() {
  const [theme, setTheme] = useGlobal("theme");

  const [color, setColor] = useState(theme.accent.replace("#", ""));
  const user = firebase.auth().currentUser;
  const context = useContext(BottomContext);
  const colorPickerRef = useRef();

  useEffect(() => {
    if (color.length === 6 && color !== theme.accent.replace("#", "")) {
      saveColor("#" + color);
    }
  }, [color]);

  useEffect(() => {
    setColor(theme.accent.replace("#", ""));
  }, [theme]);

  function updateColor(color) {
    saveColor(color);
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
  const disableScroll = () => {
    context.setScrollable(false);
  };
  const enableScroll = () => {
    context.setScrollable(true);
  };
  return (
    <View style={styles.wrapper}>
      <Type style={{ fontSize: 18 }}>Theme Color:</Type>
      <Type>Use the wheel to pick a different accent color</Type>

      {/* Pressable is required to disable scrolling on BottomSheet ScrollView when selecting a color */}
      <Pressable onTouchStart={disableScroll} onTouchEnd={enableScroll}>
        <ColorPicker
          ref={(r) => {
            colorPickerRef.current = r;
          }}
          color={theme.accent}
          onColorChangeComplete={updateColor}
          thumbSize={40}
          sliderSize={20}
          noSnap={false}
        />
      </Pressable>
      <Type>Or enter a color manually</Type>

      <Input value={color.substring(0, 6)} onChangeText={setColor} />
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
            key={icon}
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
  paddingForHeader: { paddingTop: 25 },
});
