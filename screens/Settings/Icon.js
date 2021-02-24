import React, { useCallback } from "reactn";

import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "../../components/IconButton";

import { userIconList } from "../../utils/user-icon-list";
import firebase from "../../utils/firebase";

export default function IconSettings({ closeIconModal }) {
  const [user] = useAuthState(firebase.auth());

  const updateIcon = useCallback(async (icon) => {
    await user.updateProfile({
      photoURL: icon,
    });
    closeIconModal();
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.containerStyle}>
        {userIconList.map((icon) => (
          <IconButtonWrapped
            key={icon}
            icon={icon}
            onPress={updateIcon}
            isSelected={icon === user.photoURL}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const IconButtonWrapped = ({ onPress, icon, isSelected }) => {
  const _handlePress = () => {
    onPress(icon);
  };
  return (
    <IconButton
      name={icon}
      size={Dimensions.get("window").width / 8}
      onPress={_handlePress}
      lightMode={isSelected}
      border={false}
    />
  );
};

const styles = StyleSheet.create({
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
});
