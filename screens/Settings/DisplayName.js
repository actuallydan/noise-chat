import React, { useState, useGlobal } from "reactn";

import { View, StyleSheet } from "react-native";

import Type from "../../components/Type";
import Input from "../../components/Input";
import SmallType from "../../components/SmallType";
import Button from "../../components/Button";
import randomName from "../../utils/getRandomName";
import firebase from "../../utils/firebase";

import { useAuthState } from "react-firebase-hooks/auth";

export default function DisplayNameSettings({ closeModal }) {
  const [user] = useAuthState(firebase.auth());
  const [name, setName] = useState(user.displayName || "");

  function getRandomName() {
    setName(randomName());
  }

  async function saveName() {
    if (name.trim() === "") {
      return false;
    }
    // TODO : content moderation
    await firebase.auth().currentUser.updateProfile({ displayName: name });
    closeModal();
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <Type h2>Display Name:</Type>
        <Type>Change the name that will be visible to other users</Type>
        <Input value={name} onChangeText={setName} />
        <SmallType style={styles.marginBottom}>Keep it clean</SmallType>

        <Type>Or use a different random name</Type>

        <Button onPress={getRandomName}>RANDOM</Button>
      </View>
      <Button onPress={saveName} lightMode disabled={name.trim() === ""}>
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
