import React, { Component } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { HeadingClassComponent } from "../components/Heading";
import { ThemeContext } from "../utils/theme";

let heights = [2, 3, 2, 1, 2];

const AnimatedHeading = Animated.createAnimatedComponent(HeadingClassComponent);

class AnimatedLoader extends Component {
  static contextType = ThemeContext;

  state = {
    animations: heights.map(
      (h) => new Animated.Value(h * (this.props.size / 20))
    ),
    margin: new Animated.Value(0),
  };

  componentDidMount() {
    const { size } = this.props;
    Animated.stagger(
      125,
      this.state.animations.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: size * 0.9 - heights[i] * (size / 20),
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: heights[i] * (size / 20),
              useNativeDriver: false,
            }),
          ])
        )
      )
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.margin, {
          toValue: size / 20,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.margin, {
          toValue: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }

  boxStyle = (i) => ({
    height: this.state.animations[i],
  });

  render() {
    const { size } = this.props;
    const theme = this.context;

    const boxStyle = {
      width: size / 10,
      height: size / 4,
      backgroundColor: theme.accent,
      marginHorizontal: size / 10,
    };
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <AnimatedHeading
            size={size}
            style={{
              margin: 0,
              lineHeight: size * 1.28,
              height: size,
              textAlignVertical: "center",
              paddingRight: this.state.margin,
            }}
          >
            [
          </AnimatedHeading>
          {heights.map((h, i) => (
            <Animated.View
              key={i}
              style={[boxStyle, { height: (size / 4) * h }, this.boxStyle(i)]}
            />
          ))}
          <AnimatedHeading
            size={size}
            style={{
              margin: 0,
              lineHeight: size * 1.28,
              height: size,
              textAlignVertical: "center",
              paddingLeft: this.state.margin,
            }}
          >
            ]
          </AnimatedHeading>
        </View>
      </View>
    );
  }
}
AnimatedLoader.defaultProps = {
  size: 20,
};

export default AnimatedLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
