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
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    // try {
    //   const phoneProvider = new firebase.auth.PhoneAuthProvider();
    //   const verificationId = await phoneProvider.verifyPhoneNumber(
    //     "+17177936991",
    //     firebaseRef.current
    //   );
    //   // setVerificationId(verificationId);
    //   // showMessage({
    //   //   text: "Verification code has been sent to your phone.",
    //   // });
    //   console.log("id", verificationId);
    //   setVerificationId(verificationId);
    // } catch (err) {
    //   console.log({ text: `Error: ${err.message}`, color: "red" });
    // }
  }

  async function init() {
    try {
      await authorize();
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    // firebase.auth().currentUser && firebase.auth().signOut();
    init();
    firebase.auth().onAuthStateChanged(async function (user) {
      console.log("auth user", user);
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
        // // User is signed in.
        // const uid = user.uid;
        // const name = randomName();

        // setUser(
        //   {
        //     id: uid,
        //     name,
        //     avatar: getRandomIcon(),
        //   },
        //   () => {
        navigation.dispatch(StackActions.replace("chat"));
        // }
        // );
      } else {
        // User is signed out.
        // Go back to pre-login
        setUser(null);
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
