import React, { useEffect, useGlobal } from "reactn";
import { View, StyleSheet } from "react-native";
import firebase from "../utils/firebase";
import Type from "../components/Type";
import Loader from "../components/Loader";
import randomName from "../utils/getRandomName";
import { getRandomIcon } from "../utils/user-icon-list";
import Heading from "../components/Heading";

export default function Auth() {
  const [, setUser] = useGlobal("user");

  function authorize() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInAnonymously()
        .then(resolve)
        .catch(function (error) {
          reject(error);
        });
    });
  }

  async function init() {
    try {
      await authorize();
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    init();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        const uid = user.uid;
        const name = randomName();

        setUser({
          id: uid,
          name,
          avatar: getRandomIcon(),
        });
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "space-around", alignItems: "center" }}
    >
      <Heading size={50}>[noise]</Heading>

      <View style={styles.centerCenter}>
        <Loader />
        <Type>Getting Location...</Type>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
});
