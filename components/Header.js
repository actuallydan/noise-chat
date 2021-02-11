import React, { useContext } from "reactn";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Heading() {
  const theme = useContext(ThemeContext);

  const iconWrapperStyles = [
    styles.iconWrapper,
    { backgroundColor: theme.dark },
  ];

  return (
    <View style={styles.headerView}>
      <View style={[iconWrapperStyles]}>
        <IconButton name="filter-sharp" lightMode round size={35} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
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
