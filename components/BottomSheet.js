import React, { useEffect, useRef, useState, useGlobal } from "reactn";
import { TouchableWithoutFeedback, ScrollView, View } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

export default function BottomDrawer({ children, closeModal }) {
  const [theme] = useGlobal("theme");
  const bottomDrawerRef = useRef(null);

  useEffect(() => {
    bottomDrawerRef.current.snapTo(1);
  }, []);

  function close() {
    bottomDrawerRef.current.snapTo(0);

    closeModal();
  }
  return (
    <View flex={1}>
      <BottomSheet
        ref={bottomDrawerRef}
        snapPoints={[0, "60%"]}
        renderContent={() => (
          <ScrollView
            contentContainerStyle={{
              height: "100%",
              backgroundColor: theme.dark,
              padding: 15,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}
          >
            {children}
          </ScrollView>
        )}
        onCloseEnd={close}
        // callbackNode={0}
      />
      <TouchableWithoutFeedback onPress={close}>
        <View
          style={{
            backgroundColor: "black",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0.5,
          }}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}
