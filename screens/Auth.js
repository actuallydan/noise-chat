import React, { useEffect, useGlobal, useRef } from "reactn";
import { View, StyleSheet } from "react-native";
import firebase, { firebaseConfig } from "../utils/firebase";
import Type from "../components/Type";
import Loader from "../components/Loader";
import randomName from "../utils/getRandomName";
import { getRandomIcon } from "../utils/user-icon-list";
import Heading from "../components/Heading";
import Screen from "../components/Screen";
import { StackActions } from "@react-navigation/native";

export default function Auth({ navigation }) {
  const [, setUser] = useGlobal("user");

  async function authorize() {
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
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        if (!user.photoURL) {
          await user.updateProfile({
            photoURL: getRandomIcon(),
          });
        }

        if (!user.displayName) {
          await user.updateProfile({
            displayName: randomName(),
          });
        }

        navigation.dispatch(StackActions.replace("chat"));
      } else {
        // User is signed out
        // Not sure what to do here?
      }
    });
  }, []);

  return (
    <Screen
      style={{ flex: 1, justifyContent: "space-around", alignItems: "center" }}
    >
      <Heading size={50}>[noise]</Heading>

      <View style={styles.centerCenter}>
        <Loader />
        <Type>Connecting...</Type>
      </View>
      {/* <FirebaseRecaptchaVerifierModal
        ref={firebaseRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      /> */}
      {/* <FirebaseRecaptchaBanner /> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
});
