import React, { useGlobal } from "reactn";

import { View, StyleSheet, Modal } from "react-native";
import { Portal } from "@gorhom/portal";
import Screen from "../../components/Screen";
import Type from "../../components/Type";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";
import Button from "../../components/Button";
import BottomSheet from "../../components/BottomSheet";
import useShowModal from "../../utils/useShowModal";

import firebase from "../../utils/firebase";
import Header from "../../components/Header";
import { useAuthState } from "react-firebase-hooks/auth";

import IconSettings from "./Icon";
import ColorSettings from "./Color";

import DisplayNameSettings from "./DisplayName";
import LocationSettings from "./Location";

export default function Settings({ navigation }) {
  const [showColorModal, closeColorModal, openColorModal] = useShowModal(false);
  const [showIconModal, closeIconModal, openIconModal] = useShowModal(false);

  const [
    showDisplayNameModal,
    closeDisplayNameModal,
    openDisplayNameModal,
  ] = useShowModal(false);

  const [
    showLocationModal,
    closeLocationModal,
    openLocationModal,
  ] = useShowModal(false);

  const [location] = useGlobal("location");

  const latLongID = location
    ? location.latitude.toFixed(2) + "+" + location.longitude.toFixed(2)
    : "99.99+99.99";

  const [firebaseUser] = useAuthState(firebase.auth());

  let user = null;
  // if the user isn't logged in, give the app some default data
  if (!firebaseUser) {
    user = {
      displayName: "",
      photoURL: "person-circle-sharp",
      uid: "",
    };
  } else {
    user = firebaseUser;
  }

  function goBack() {
    navigation.goBack();
  }

  function goToLinkAccount() {
    navigation.navigate("linkPhone");
  }

  function signOut() {
    firebase.auth().signOut();
    navigation.navigate("chat");
  }
  // TODO: refactor these
  function renderIconPortal() {
    return (
      <Portal>
        <Modal transparent visible={showIconModal}>
          <BottomSheet closeModal={closeIconModal}>
            <IconSettings closeIconModal={closeIconModal} />
          </BottomSheet>
        </Modal>
      </Portal>
    );
  }
  function renderColorPortal() {
    return (
      <Portal>
        <Modal transparent visible={showColorModal}>
          <BottomSheet closeModal={closeColorModal}>
            <ColorSettings />
          </BottomSheet>
        </Modal>
      </Portal>
    );
  }
  function renderDisplayNamePortal() {
    return (
      <Portal>
        <Modal transparent visible={showDisplayNameModal}>
          <BottomSheet
            closeModal={closeDisplayNameModal}
            drawerStyles={{ height: "100%" }}
          >
            <DisplayNameSettings closeModal={closeDisplayNameModal} />
          </BottomSheet>
        </Modal>
      </Portal>
    );
  }
  function renderLocationPortal() {
    return (
      <Portal>
        <Modal transparent visible={showLocationModal}>
          <BottomSheet
            closeModal={closeLocationModal}
            drawerStyles={{ height: "100%" }}
          >
            <LocationSettings closeModal={closeLocationModal} />
          </BottomSheet>
        </Modal>
      </Portal>
    );
  }

  return (
    <Screen style={styles.wrapper}>
      <Header onPress={goBack} topIcon={"chevron-back-sharp"} />
      <View style={[styles.wrapper, styles.paddingForHeader]}>
        <Type h1 style={{ marginBottom: 20, marginTop: 35 }} h1>
          Settings
        </Type>

        <View style={styles.sectionWrapper}>
          <Type h2>Display Name:</Type>
          <Input
            editable={false}
            value={user.displayName}
            onPress={openDisplayNameModal}
          />

          {renderDisplayNamePortal()}
        </View>

        <View style={styles.sectionWrapper}>
          <Type h2>Location:</Type>
          <Input
            editable={false}
            value={latLongID}
            onPress={openLocationModal}
          />

          {renderLocationPortal()}
        </View>
        <View style={styles.sectionWrapper}>
          <Type h2>User Icon:</Type>
          <IconButton
            name={user.photoURL}
            size={60}
            containerStyle={styles.marginBottom}
            onPress={openIconModal}
          />
          {renderIconPortal()}
        </View>
        <View style={styles.sectionWrapper}>
          <Type h2>Theme Color:</Type>
          <Button onPress={openColorModal}>EDIT COLOR</Button>
          {renderColorPortal()}
        </View>
        {user.isAnonymous && (
          <View style={styles.sectionWrapper}>
            <Type h2>Verify Account:</Type>
            <Type>
              Link your anonymous account with your phone number to make sure
              your settings are saved. Your information will still be private!
            </Type>
            <Button onPress={goToLinkAccount}>Link Account</Button>
          </View>
        )}
        <View style={styles.sectionWrapper}>
          <Type h2>Sign Out</Type>
          <Button onPress={signOut} lightMode>
            Sign Out
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  marginBottom: {
    marginBottom: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  containerStyle: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  paddingForHeader: { paddingTop: 25 },
  sectionWrapper: {
    marginBottom: 25,
  },
});
