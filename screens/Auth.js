import React, { useEffect, useGlobal } from "reactn";
import { View } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import Type from "../components/Type";
import Loader from "../components/Loader";
import randomName from "../utils/getRandomName";
import { getRandomIcon } from "../utils/user-icon-list";

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Loader />
      <Type>Getting Location...</Type>
    </View>
  );
}
