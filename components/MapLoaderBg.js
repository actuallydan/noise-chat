import React, { useEffect, useRef, useMemo, useGlobal } from "reactn";

import { View, Platform, ImageBackground, Animated } from "react-native";

const AnimatedImageBackground = Animated.createAnimatedComponent(
  ImageBackground
);

export default function MapLoaderBg({ shouldLoop = false, ...props }) {
  const [shouldLoopGlobal, setShouldLoop] = useGlobal("shouldLoop");
  const translateRef = useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
  });

  function getWholeAnimation() {
    const { x, y } = translateRef.current;

    const full = props.dimensions.height / 9;

    return Animated.sequence([
      getAnimation(x, full),
      getAnimation(y, full / 2),

      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            getAnimation(x, -1 * full),
            getAnimation(y, -1 * full),
          ]),
          getAnimation(y, full),
          Animated.parallel([
            getAnimation(x, full),
            getAnimation(y, -1 * full),
          ]),
          getAnimation(y, full),
        ])
      ),
    ]);
  }

  const shouldUseNativeDriver = useMemo(() => Platform.OS !== "web", []);

  function getAnimation(ref, to, duration = 2000) {
    return Animated.timing(ref, {
      toValue: to,
      useNativeDriver: shouldUseNativeDriver,
      duration,
    });
  }

  useEffect(() => {
    const { x, y } = translateRef.current;

    let anim = getWholeAnimation();

    if (shouldLoop) {
      anim.start();
    } else {
      setInterval(() => {
        setShouldLoop(true);
        setTimeout(() => {
          setShouldLoop(false);
        }, 1000 * 30);
      }, 1000 * 60);
    }

    return () => {
      anim.stop();

      Animated.parallel([
        getAnimation(x, 0, 250),
        getAnimation(y, 0, 250),
      ]).start();
    };
  }, [shouldLoop]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 0,
        width: props.dimensions.width,
        height: props.dimensions.height,
      }}
    >
      <AnimatedImageBackground
        source={require("../assets/noise-streets.png")}
        resizeMode={"contain"}
        style={[
          {
            opacity: 0.5,
            width: props.dimensions.height,
            height: props.dimensions.height,
            transform: [
              { translateX: translateRef.current.x },
              { translateY: translateRef.current.y },
            ],
          },
        ]}
      />
    </View>
  );
}
