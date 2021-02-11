import React, { useState, useEffect, useGlobal, setGlobal } from "reactn";

import { StyleSheet, View, Dimensions, Platform, LogBox } from "react-native";
// import AppLoading from "expo-app-loading";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { defaultTheme } from "./utils/theme";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
const Stack = createStackNavigator();

import Chat from "./screens/Chat";
import Auth from "./screens/Auth";
import Settings, { ColorSettings } from "./screens/Settings";

// init reactn store
setGlobal({
  location: null,
  user: null,
  theme: defaultTheme,
});

if (process.env.NODE_ENV !== "production") {
  Platform.OS !== "web" && LogBox.ignoreLogs(["Setting a timer"]);
}

export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);

  const [location, setLocation] = useGlobal("location");
  const [user] = useGlobal("user");
  const [theme, setTheme] = useGlobal("theme");
  const [appReady, setAppReady] = useState(false);
  const [, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const [fontsLoaded] = useFonts({
    "Atkinson-Hyperlegible": require("./assets/fonts/Atkinson-Hyperlegible.otf"),
    "Teko-Medium": require("./assets/fonts/Teko-Medium.ttf"),
  });

  const updateTheme = (color) => {
    setTheme({ ...theme, accent: color });
  };

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

      const color = await AsyncStorage.getItem("accent-color");
      color && updateTheme(color);
    })();

    Dimensions.addEventListener("change", resize);

    setAppReady(true);
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
  if (!fontsLoaded || !appReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={containerStyle} onLayout={onRotate}>
            {/* {user && location ? <Chat /> : <Auth />} */}
            <Stack.Navigator
              initialRouteName="auth"
              screenOptions={{
                cardStyle: { backgroundColor: "transparent" },
                cardOverlayEnabled: false,
                headerShown: false,
              }}
              headerMode={"none"}
            >
              <Stack.Screen name="auth" component={Auth} />

              <Stack.Screen name="chat" component={Chat} />
              <Stack.Screen name="settings" component={Settings} />
              {/* <Stack.Screen
                name="colorSettings"
                component={ColorSettings}
                // options={({ route, navigation }) => ({
                //   animationEnabled: true,
                //   gestureEnabled: true,
                //   cardOverlayEnabled: false,
                //   cardStyle: { height: "50%" },
                //   cardShadowEnabled: true,
                //   ...TransitionPresets.ModalPresentationIOS,
                // })}
                
                options={{
                  
                  headerShown: false,
                  cardStyle: { backgroundColor: "transparent" },
                  cardOverlayEnabled: true,
                  cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                      opacity: progress.interpolate({
                        inputRange: [0, 0.5, 0.9, 1],
                        outputRange: [0, 0.25, 0.7, 1],
                      }),
                    },
                    overlayStyle: {
                      opacity: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.5],
                        extrapolate: "clamp",
                      }),
                    },
                  }),
                  m
                }}
              /> */}
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
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
