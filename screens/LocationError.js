import React, { useGlobal, useState } from "reactn";

import { StyleSheet, View } from "react-native";

import * as Location from "expo-location";

import { SafeAreaProvider } from "react-native-safe-area-context";
import Button from "../components/Button";
import Screen from "../components/Screen";
import Loader from "../components/Loader";
import Type from "../components/Type";

export default function LocationError() {
  const [, setLocationPermissionAllowed] = useGlobal(
    "locationPermissionAllowed"
  );
  const [loading, setLoading] = useState(false);
  const tryGetPermission = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestPermissionsAsync();
      setLocationPermissionAllowed(status === "granted");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <Screen style={{ justifyContent: "center", alignItems: "center" }}>
        <Type style={{ marginBottom: 20, paddingHorizontal: 20 }}>
          {`
Location Services are disabled.

To use Noise, please enable location services.`}
        </Type>

        {loading ? (
          <Loader />
        ) : (
          <Button onPress={tryGetPermission}>Get Location</Button>
        )}
      </Screen>
    </SafeAreaProvider>
  );
}
