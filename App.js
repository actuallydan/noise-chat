import React, { useState, useEffect, useGlobal, setGlobal } from "reactn";

import { StatusBar, StyleSheet, View, Text, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";

// import * as Font from "expo-font";

import { setCustomText, setCustomTextInput } from "react-native-global-props";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Chat from "./screens/Chat";
import Loading from "./screens/Loading";

setGlobal({
  location: null,
});

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [location, setLocation] = useGlobal("location");
  const [errorMsg, setErrorMsg] = useState(null);

  const [, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const {
        coords: { latitude, longitude },
      } = location;

      setLocation({ latitude, longitude });
    })();

    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync();

        // Load our initial navigation state
        // setInitialNavigationState(await getInitialState());

        // Load fonts
        // await Font.loadAsync({
        //   SpaceGrotesk: require("./assets/fonts/SpaceGrotesk_SemiBold.otf"),
        // });

        // // if we have a preferred theme in storage, set it before we load the app
        // if (res !== null) {
        //   setActiveTheme(themes[res]);
        // }

        // Make sure to use this font EVERYWHERE so we don't have to manually assign it
        const customTextProps = {
          style: {
            // fontFamily: "SpaceGrotesk",
          },
        };
        // I don't think this does anything...at least in web
        Text.defaultProps = Text.defaultProps || {};
        // Text.defaultProps.style = { fontFamily: "SpaceGrotesk" };

        setCustomText(customTextProps);
        setCustomTextInput(customTextProps);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // SplashScreen.hideAsync();
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
    Dimensions.addEventListener("change", resize);

    return () => {
      Dimensions.removeEventListener("change", resize);
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
    console.log(errorMsg);
  } else if (location) {
    console.log(JSON.stringify(location, null, 2));
  }

  // don't return anything if not ready, this way we display the loading screen longer
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onRotate}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {location ? <Chat /> : <Loading />}
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    // backgroundColor: "#282a38",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});
