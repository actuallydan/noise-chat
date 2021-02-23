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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Portal } from "@gorhom/portal";
import Screen from "../components/Screen";
import Type from "../components/Type";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import SmallType from "../components/SmallType";
import Button from "../components/Button";
import { defaultTheme } from "../utils/theme";
import BottomSheet, { BottomContext } from "../components/BottomSheet";
import { userIconList } from "../utils/user-icon-list";
import firebase from "../utils/firebase";
import Header from "../components/Header";
import ColorPicker from "react-native-wheel-color-picker";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Settings({ navigation }) {
  const [showColorModal, setShowColorModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [user] = useAuthState(firebase.auth());

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

  function goToLinkAccount() {
    navigation.navigate("linkPhone");
  }

  function signOut() {
    firebase.auth().signOut();
    navigation.navigate("chat");
  }
  // TODO: refactor these
  function renderIconPortal() {
    return (
      <Portal>
        <Modal transparent visible={showIconModal}>
          <BottomSheet closeModal={closeIconModal}>
            <IconSettings closeIconModal={closeIconModal} />
          </BottomSheet>
        </Modal>
      </Portal>
    );
  }
  function renderColorPortal() {
    return (
      <Portal>
        <Modal transparent visible={showColorModal}>
          <BottomSheet closeModal={closeColorModal}>
            <ColorSettings />
          </BottomSheet>
        </Modal>
      </Portal>
    );
  }
  return (
    <Screen style={styles.wrapper}>
      <Header onPress={goBack} topIcon={"chevron-back-sharp"} />
      <View style={[styles.wrapper, styles.paddingForHeader]}>
        <Type style={{ marginBottom: 20, marginTop: 35 }} h1>
          Settings
        </Type>
        <View style={styles.sectionWrapper}>
          <Type h2>User Icon:</Type>
          <IconButton
            name={user.photoURL}
            size={60}
            containerStyle={styles.marginBottom}
            onPress={goToIconSettings}
          />
          {renderIconPortal()}
        </View>
        <View style={styles.sectionWrapper}>
          <Type h2>Theme Color:</Type>
          <Button onPress={goToColorSettings}>EDIT COLOR</Button>
          {renderColorPortal()}
        </View>
        <View style={styles.sectionWrapper}>
          <Type h2>Verify Account:</Type>
          <Type>
            Link your anonymous account with your phone number to make sure your
            settings are saved. Your information will still be private!
          </Type>
          <Button onPress={goToLinkAccount}>Link Account</Button>
        </View>
        <View style={styles.sectionWrapper}>
          <Type h2>Sign Out</Type>
          <Button onPress={signOut}>Sign Out</Button>
        </View>
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
  const [user] = useAuthState(firebase.auth());

  const updateIcon = useCallback(async (icon) => {
    await user.updateProfile({
      photoURL: icon,
    });
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
            isSelected={icon === user.photoURL}
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
  sectionWrapper: {
    marginBottom: 25,
  },
});
