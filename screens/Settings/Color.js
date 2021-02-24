import React, {
  useEffect,
  useState,
  useGlobal,
  useRef,
  useContext,
} from "reactn";

import { View, StyleSheet, Pressable } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ColorPicker from "react-native-wheel-color-picker";

import Type from "../../components/Type";
import Input from "../../components/Input";
import SmallType from "../../components/SmallType";
import Button from "../../components/Button";
import { defaultTheme } from "../../utils/theme";
import { BottomContext } from "../../components/BottomSheet";

export default function ColorSettings() {
  const [theme, setTheme] = useGlobal("theme");

  const [color, setColor] = useState(theme.accent.replace("#", ""));
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
      <Type h2>Theme Color:</Type>
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
      <Button onPress={setToDefault} lightMode>
        RESET
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});
