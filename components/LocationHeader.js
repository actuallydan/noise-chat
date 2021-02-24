import React, { useGlobal } from "reactn";
import { View, StyleSheet } from "react-native";
import Type from "./Type";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LocationHeader({ onPress, locationID = "", ...props }) {
  const [theme] = useGlobal("theme");
  const insets = useSafeAreaInsets();

  const iconWrapperStyles = [
    styles.iconWrapper,
    {
      backgroundColor: theme.dark,
      top: insets.top,
      borderRadius: 9999,
      borderWidth: 3,
      borderColor: theme.dark,
    },
  ];
  locationID = locationID.replace("+", " + ");
  return (
    <View style={styles.headerView}>
      <TouchableOpacity onPress={onPress}>
        <View style={[iconWrapperStyles, { backgroundColor: theme.accent }]}>
          <Type lightMode style={styles.headerTextStyles}>
            {locationID}
          </Type>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  iconWrapperStyles: {
    borderRadius: 9999,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  headerTextStyles: { paddingHorizontal: 10, paddingVertical: 5 },
});
