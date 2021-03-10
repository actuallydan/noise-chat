import React, { useEffect, useGlobal, useRef } from "reactn";
import firebase, { firebaseConfig } from "../utils/firebase";
import randomName from "../utils/getRandomName";
import { getRandomIcon } from "../utils/user-icon-list";
import { StackActions } from "@react-navigation/native";
import LoadingScreen from "../components/LoadingScreen";

export default function Auth({ navigation }) {
  const [, setShouldLoop] = useGlobal("shouldLoop");

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
    setShouldLoop(true);
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
      setShouldLoop(false);
    });
  }, []);

  return <LoadingScreen loadingText={"Connecting..."} />;
}
