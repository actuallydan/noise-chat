import React, { useGlobal } from "reactn";
import { Text, StyleSheet } from "react-native";

export default function Heading({
  children,
  size = 30,
  lightMode = false,
  style = {},
  ...props
}) {
  const [theme] = useGlobal("theme");

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

export class HeadingClassComponent extends React.Component {
  render() {
    const {
      children,
      size = 30,
      lightMode = false,
      style = {},
      ...props
    } = this.props;

    const { theme } = this.global;

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
