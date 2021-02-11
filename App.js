import React, { useState, useEffect, useGlobal, setGlobal } from "reactn";

import { StyleSheet, View, Dimensions, Platform, LogBox } from "react-native";
// import AppLoading from "expo-app-loading";
import * as Location from "expo-location";
import { useFonts } from "expo-font";

import { theme, ThemeContext } from "./utils/theme";

import { SafeAreaProvider } from "react-native-safe-area-context";

import Chat from "./screens/Chat";
import Auth from "./screens/Auth";
import LoaderTest from "./screens/LoaderTest";

// init reactn store
setGlobal({
  location: null,
  user: null,
});

if (process.env.NODE_ENV !== "production") {
  Platform.OS !== "web" && LogBox.ignoreLogs(["Setting a timer"]);
}

export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);

  const [location, setLocation] = useGlobal("location");
  const [user] = useGlobal("user");

  const [, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const [fontsLoaded] = useFonts({
    "Atkinson-Hyperlegible": require("./assets/fonts/Atkinson-Hyperlegible.otf"),
    "Teko-Medium": require("./assets/fonts/Teko-Medium.ttf"),
  });

  const updateTheme = (color) => {
    theme.accent = color;
    // also save the value in async storage for the future
    AsyncStorage.setItem("accent-color");
  };

  theme.updateAccent = updateTheme;

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    let listener = { remove: () => {} };
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      // let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
      listener = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Low,
          // re-poll
          timeInterval: 60000,
        },
        (newLocation) => {
          const {
            coords: { latitude, longitude },
          } = newLocation;

          console.log(
            location,
            latitude,
            longitude,
            location?.latitude === latitude,
            location?.longitude === longitude
          );

          // TODO: only update if they aren't the within the same 0.01 degrees
          setLocation({ latitude, longitude });
        }
      );
    })();

    Dimensions.addEventListener("change", resize);

    return () => {
      Dimensions.removeEventListener("change", resize);
      listener.remove();
    };
  }, []);

  // on browser resize, or in the bizarre case of the app resizing on a tablet or some nonsense
  const resize = ({ window }) => {
    setDimensions({
      width: window.width,
      height: window.height,
    });
  };

  // if the device's orientation is flipped
  const onRotate = () => {
    setDimensions({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    });
  };

  if (errorMsg) {
    console.error(errorMsg);
  }

  const containerStyle = [styles.container, { backgroundColor: theme.dark }];
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ThemeContext.Provider value={theme}>
        <SafeAreaProvider>
          <View style={containerStyle} onLayout={onRotate}>
            {user && location ? <Chat /> : <Auth />}
          </View>
        </SafeAreaProvider>
      </ThemeContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});
