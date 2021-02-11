import React, { Component, useContext } from "react";
import { Text, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/theme";

export default function Heading({
  children,
  size = 30,
  lightMode = false,
  style = {},
  ...props
}) {
  const theme = useContext(ThemeContext);

  const textStyle = [
    defaultStyles.text,
    {
      fontSize: size,
      color: lightMode ? theme.dark : theme.accent,
    },
    textStyle,
    style,
  ];
  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

export class HeadingClassComponent extends Component {
  static contextType = ThemeContext;

  render() {
    const {
      children,
      size = 30,
      lightMode = false,
      style = {},
      ...props
    } = this.props;

    const theme = this.context;
    const textStyle = [
      defaultStyles.text,
      {
        fontSize: size,
        color: lightMode ? theme.dark : theme.accent,
      },
      textStyle,
      style,
    ];
    return (
      <Text style={textStyle} {...props}>
        {children}
      </Text>
    );
  }
}

const defaultStyles = StyleSheet.create({
  text: {
    fontFamily: "Teko-Medium",
    marginVertical: 5,
  },
});
