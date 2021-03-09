// @generated: @expo/next-adapter@2.1.61
import React, { setGlobal, useGlobal, useEffect, useState } from "reactn";
import { StyleSheet, View, Linking, ScrollView, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Type from "../components/Type";
import Loader from "../components/Loader";
import Heading from "../components/Heading";
import Screen from "../components/Screen";

import { defaultTheme } from "../utils/theme";

import { useFonts } from "expo-font";

import Atkinson from "../assets/fonts/Atkinson-Hyperlegible.otf";
import Teko from "../assets/fonts/Teko-Medium.ttf";
import Button from "../components/Button";

// manually load images like an idiot
import screen1 from "../assets/assets-for-readme/noise-chat-1.png";
// import screen2 from "../assets/assets-for-readme/noise-chat-2.png";
import screen3 from "../assets/assets-for-readme/noise-theme-green.png";
import screen4 from "../assets/assets-for-readme/noise-chat-green.png";
import screen5 from "../assets/assets-for-readme/noise-chat-red.png";
import screen6 from "../assets/assets-for-readme/noise-chat-icons.png";
import IconButton from "../components/IconButton";

setGlobal({
  location: null,
  theme: defaultTheme,
  locationPermissionAllowed: true,
  shouldUseCurrentLocation: true,
});

export default function App() {
  const [theme, setTheme] = useGlobal("theme");
  const [width, setWidth] = useState(0);

  const [loaded] = useFonts({
    "Atkinson-Hyperlegible": { uri: Atkinson },
    "Teko-Medium": { uri: Teko },
  });

  useEffect(() => {
    const changeSize = () => {
      setWidth(window.innerWidth);
    };

    changeSize();
    window.addEventListener("resize", changeSize, { passive: true });

    return () => {
      window.removeEventListener("resize", changeSize);
    };
  }, []);

  const goToGithub = () => {
    Linking.openURL("https://github.com/actuallydan/noise-chat");
  };

  if (!loaded) {
    return (
      <SafeAreaProvider>
        <Screen
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.dark,
          }}
        >
          <Loader />
        </Screen>
      </SafeAreaProvider>
    );
  }

  const isMobile = width < 400;

  const slides = [
    { text: "Stylish, hyperlocal, and anonymous chat", src: screen1 },
    { text: "Custom themeing", src: screen3 },
    {
      text: "Use ephermerally, or link your phone number to keep your data",
      src: screen4,
    },
    {
      text: "Machine Learning moderation and opt-in message-level filtering",
      src: screen5,
    },
    { text: "Lots of icons!", src: screen6 },
  ];

  const imageStyle = {
    borderRadius: "10px",
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: "#ffd18c",
    marginBottom: "10px",
    width: "200px",
  };

  const openAndroid = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=chat.choir.noise",
      "_blank"
    );
  };

  const fullscreenScroll =
    width > 1000
      ? { width: "100%", maxWidth: "1200", justifyContent: "space-evenly" }
      : {};

  return (
    <SafeAreaProvider>
      <Screen
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: theme.dark,
        }}
      >
        <View style={styles.headingFlex}>
          <Heading size={50}>[noise]</Heading>

          {isMobile ? (
            <IconButton
              onPress={goToGithub}
              size={35}
              lightMode
              name={"logo-github"}
            />
          ) : (
            <Button
              onPress={goToGithub}
              uppercase={false}
              withIcon={"logo-github"}
              lightMode
            >
              Check it out on GitHub
            </Button>
          )}
        </View>
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button
            onPress={openAndroid}
            lightMode
            withIcon={"logo-google-playstore"}
          >
            Play Store
          </Button>
          <Button disabled withIcon={"logo-apple-appstore"} uppercase={false}>
            Coming Soon
          </Button>
        </View>
        <ScrollView
          horizontal
          style={{ width: "100%", padding: 20 }}
          contentContainerStyle={{
            alignItems: "space-around",
            ...fullscreenScroll,
          }}
          snapToInterval={1}
          indicatorStyle={"white"}
          centerContent
        >
          {slides.map((slide) => {
            return (
              <View key={slide.src} style={styles.imageWrapper}>
                <img src={slide.src} style={imageStyle} />
                <Type style={styles.imageText}>{slide.text}</Type>
              </View>
            );
          })}
        </ScrollView>
      </Screen>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  headingFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  imageWrapper: {
    marginHorizontal: 15,
    width: 200,
  },
  imageText: {
    textAlign: "center",
  },
});
