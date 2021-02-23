import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";

import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { useAuthState } from "react-firebase-hooks/auth";
import { StackActions } from "@react-navigation/native";

import Screen from "../components/Screen";
import Input from "../components/Input";
import Type from "../components/Type";
import Button from "../components/Button";
import Header from "../components/Header";

import firebase, { firebaseConfig } from "../utils/firebase";
import randomName from "../utils/getRandomName";
import { getRandomIcon } from "../utils/user-icon-list";

const auth = firebase.auth();

export default function LinkPhone({ navigation, ...props }) {
  const firebaseRef = useRef(null);
  const [verificationId, setVerificationId] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user] = useAuthState(auth);

  const getPhoneCode = async () => {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phone,
        firebaseRef.current
      );

      setVerificationId(verificationId);
    } catch (err) {
      console.error(err);
    }
  };
  const tryToLink = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode.substring(0, 6)
      );
      // convert existing user to credentialed user
      // console.log(
      //   "current user photo and such",
      //   user.photoURL,
      //   user.displayName,
      //   user.phoneNumber
      // );

      if (user) {
        await user.linkWithCredential(credential);
      } else {
        // If user isn't currently signed in anonymously (regardless of whether they have made an account before)
        // Sign them In/up
        await firebase.auth().signInWithCredential(credential);
        if (!firebase.auth().currentUser.photoURL) {
          await firebase.auth().currentUser.updateProfile({
            photoURL: getRandomIcon(),
          });
        }

        if (!firebase.auth().currentUser.displayName) {
          await firebase.auth().currentUser.updateProfile({
            displayName: randomName(),
          });
        }
      }
      console.log("Phone authentication successful 👍");
      // link current username and icon with user
      // console.log("firebase user?", firebase.auth().currentUser);
      console.log("hook user?", firebase.auth().currentUser);

      navigation.dispatch(StackActions.replace("chat"));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const renderStep1 = () => (
    <>
      <Type>{`
Enter your phone number for verification.
A text message with a confirmation code will be sent to your phone.
      `}</Type>
      <Input
        value={phone}
        onChangeText={setPhone}
        placeholder={"+1 999 9999"}
        keyboardType={"phone-pad"}
        autoCompleteType={"tel"}
      />

      <Button onPress={getPhoneCode} disabled={!phone.trim()}>
        Link
      </Button>
    </>
  );
  const renderStep2 = () => (
    <>
      <Type>{`
Enter the verification code you received on your phone.
By pressing "Pair", you'll link your current activity to your number and you can sign in with your phone number in the future.
      `}</Type>
      <Input
        value={verificationCode.substring(0, 6)}
        onChangeText={setVerificationCode}
        placeholder={"012345"}
        keyboardType={"phone-pad"}
      />

      <Button disabled={!verificationCode.trim()} onPress={tryToLink}>
        Pair
      </Button>
    </>
  );

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Screen>
      <Header onPress={goBack} topIcon={"close"} />

      <View style={styles.paddingForHeader}>
        <Type h1>Link With Phone</Type>

        {verificationId ? renderStep2() : renderStep1()}
        <FirebaseRecaptchaVerifierModal
          ref={firebaseRef}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={true}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  paddingForHeader: { paddingTop: 50 },
});
