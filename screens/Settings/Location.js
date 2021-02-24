import React, { useState, useGlobal, useEffect } from "reactn";

import { View, StyleSheet } from "react-native";

import Type from "../../components/Type";
import Input from "../../components/Input";
import SmallType from "../../components/SmallType";
import Button from "../../components/Button";
import randomName from "../../utils/getRandomName";
import firebase from "../../utils/firebase";

import { useAuthState } from "react-firebase-hooks/auth";

export default function DisplayNameSettings({ closeModal }) {
  const [location, setLocation] = useGlobal("location");
  const [, setShouldUseCurrentLocation] = useGlobal("shouldUseCurrentLocation");
  const latLongID = location
    ? location.latitude.toFixed(2) + "+" + location.longitude.toFixed(2)
    : "99.99+99.99";

  const [tempLocation, setTempLocation] = useState(latLongID);

  useEffect(() => {
    setTempLocation(
      location.latitude.toFixed(2) + "+" + location.longitude.toFixed(2)
    );
  }, [location]);

  async function saveLocation() {
    if (tempLocation.trim() === "") {
      return false;
    }

    let loc = tempLocation.trim();

    loc = loc.replace(" ", "");

    if (!/^-*\d{1,2}\.\d{2}\+-*\d{1,3}\.\d{2}$/.test(loc)) {
      // invalid format
    }
    loc = loc.split("+");
    // TODO : content moderation
    setLocation(
      { latitude: parseFloat(loc[0]), longitude: parseFloat(loc[1]) },
      () => {
        setShouldUseCurrentLocation(false);
        closeModal();
      }
    );
  }

  function getMyLocation() {
    setShouldUseCurrentLocation(true, () => {
      closeModal();
    });
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <Type h2>Location:</Type>
        <Type>Set your location to check in on other neighborhoods</Type>
        <Input value={tempLocation} onChangeText={setTempLocation} />
        <SmallType style={styles.marginBottom}>{`
Location ID must be a Latitude + Longitude pair, rounded to the nearest 0.01 decimal.

For example "39.26 + -77.03" would be equivalent to 39.26 degrees North Latitude, 77.03 degrees West Longitude        
        `}</SmallType>

        <Type>Or use yor current location:</Type>

        <Button onPress={getMyLocation}>My Location</Button>
      </View>
      <Button
        onPress={saveLocation}
        lightMode
        disabled={tempLocation.trim() === ""}
      >
        SAVE
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
    justifyContent: "space-between",
    alignItems: "stretch",
  },
});
