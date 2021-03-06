import React, {
  useState,
  useEffect,
  useGlobal,
  setGlobal,
  useRef,
} from "reactn";

import { StyleSheet, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import * as Updates from "expo-updates";

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
import Settings from "./screens/Settings";
import LocationError from "./screens/LocationError";
import LinkPhone from "./screens/LinkPhone";
import MapLoaderBg from "./components/MapLoaderBg";
import LoadingScreen from "./components/LoadingScreen";

import { PortalHost } from "@gorhom/portal";

// init reactn store
setGlobal({
  location: null,
  theme: defaultTheme,
  locationPermissionAllowed: true,
  shouldUseCurrentLocation: true,
  shouldLoop: false,
});

if (process.env.NODE_ENV !== "production" && Platform.OS !== "web") {
  const { LogBox } = require("react-native");
  LogBox.ignoreLogs(["Setting a timer"]);
}

export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);

  const [locationPermissionAllowed, setLocationPermissionsAllowed] = useGlobal(
    "locationPermissionAllowed"
  );
  const [shouldUseCurrentLocation, setShouldUseCurrentLocation] = useGlobal(
    "shouldUseCurrentLocation"
  );

  const [location, setLocation] = useGlobal("location");
  const [shouldLoop] = useGlobal("shouldLoop");
  const [theme, setTheme] = useGlobal("theme");

  const [appReady, setAppReady] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const locationRef = useRef({ remove: () => {} });

  const [fontsLoaded] = useFonts({
    "Atkinson-Hyperlegible": require("./assets/fonts/Atkinson-Hyperlegible.otf"),
    "Teko-Medium": require("./assets/fonts/Teko-Medium.ttf"),
  });

  const updateTheme = (color) => {
    setTheme({ ...theme, accent: color });
  };

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function init() {
      // OTA
      if (process.env.NODE_ENV === "production") {
        let { isAvailable } = await Updates.checkForUpdateAsync();

        if (isAvailable) {
          await Updates.reloadAsync();
          return;
        }
      }

      const color = await AsyncStorage.getItem("accent-color");
      color && updateTheme(color);
    }

    init();

    Dimensions.addEventListener("change", resize);
    setAppReady(true);

    return () => {
      Dimensions.removeEventListener("change", resize);
    };
  }, []);

  const watchLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setLocationPermissionsAllowed(false);
      return;
    }

    // let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
    locationRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Low,
        // re-poll
        timeInterval: 60000,
      },
      (newLocation) => {
        const {
          coords: { latitude, longitude },
        } = newLocation;

        if (
          location?.latitude !== latitude &&
          location?.longitude !== longitude
        ) {
          setLocation({ latitude, longitude });
        }
      }
    );
  };

  // set up app to listen to location if allowed
  useEffect(() => {
    if (locationPermissionAllowed && shouldUseCurrentLocation) {
      watchLocation();
    }

    return () => {
      locationRef.current.remove();
    };
  }, [locationPermissionAllowed, shouldUseCurrentLocation]);

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

  const containerStyle = [styles.container, { backgroundColor: theme.dark }];

  if (errorMsg || !locationPermissionAllowed) {
    errorMsg && console.error(errorMsg);
    return (
      <View style={containerStyle} onLayout={onRotate}>
        <LocationError />
      </View>
    );
  }

  const shouldShowLoader = !fontsLoaded || !appReady || !location;
  // otherwise display app as normal
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={containerStyle} onLayout={onRotate}>
          <MapLoaderBg
            dimensions={dimensions}
            shouldLoop={shouldLoop || shouldShowLoader}
          />
          {shouldShowLoader ? (
            <LoadingScreen loadingText={""} />
          ) : (
            <PortalHost>
              <Stack.Navigator
                initialRouteName="chat"
                screenOptions={{
                  cardStyle: { backgroundColor: "transparent" },
                  cardOverlayEnabled: false,
                  headerShown: false,
                  ...TransitionPresets.ScaleFromCenterAndroid,
                }}
                headerMode={"none"}
              >
                <Stack.Screen name="auth" component={Auth} />

                <Stack.Screen name="chat" component={Chat} />
                <Stack.Screen name="settings" component={Settings} />
                <Stack.Screen name="linkPhone" component={LinkPhone} />
              </Stack.Navigator>
            </PortalHost>
          )}
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
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
