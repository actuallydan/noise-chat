import React, { useGlobal } from "reactn";
import { View, StyleSheet } from "react-native";
import IconButton from "./IconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header({
  onPress,
  topIcon = "filter-sharp",
  ...props
}) {
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

  return (
    <View style={styles.headerView}>
      <View style={[iconWrapperStyles]}>
        <IconButton
          name={topIcon}
          lightMode
          round
          size={35}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 5,
    left: 10,
    zIndex: 2,
  },
  iconWrapperStyles: {
    borderRadius: 9999,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
