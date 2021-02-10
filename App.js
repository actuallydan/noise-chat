import React, { useState, useEffect, useGlobal, setGlobal } from "reactn";

import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Platform,
  LogBox,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Location from "expo-location";
import Loader from "./components/Loader";
import { useFonts } from "expo-font";
import firebase from "firebase/app";
import "firebase/auth";
import { theme, ThemeContext } from "./utils/theme";

import Header from "./components/Header";
import Type from "./components/Type";
import BigInput from "./components/BigInput";
import Card from "./components/Card";
import IconButton from "./components/IconButton";
import Button from "./components/Button";
import Input from "./components/Input";
import SmallType from "./components/SmallType";
import Screen from "./components/Screen";
// import { setCustomText, setCustomTextInput } from "react-native-global-props";

import { SafeAreaProvider } from "react-native-safe-area-context";

import Chat from "./screens/Chat";
// import Loading from "./screens/Loading";
import Auth from "./screens/Auth";

// init reactn store
setGlobal({
  location: null,
  user: null,
});

if (process.env.NODE_ENV !== "production") {
  Platform.OS !== "web" && LogBox.ignoreLogs(["Setting a timer"]);
}
// init firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

export default function App(props) {
  const [value, setValue] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const [location, setLocation] = useGlobal("location");
  const [user] = useGlobal("user");

  const [, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const [fontsLoaded] = useFonts({
    "Atkinson-Hyperlegible": require("./assets/fonts/Atkinson-Hyperlegible.otf"),
    Lora: require("./assets/fonts/Lora.ttf"),
  });

  const updateTheme = (color) => {
    theme.accent = color;
    // also save the value in async storage for the future
    AsyncStorage.setItem("accent-color");
  };

  theme.updateAccent = updateTheme;

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
