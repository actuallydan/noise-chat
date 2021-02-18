import React, {
  useEffect,
  useRef,
  useState,
  useGlobal,
  createContext,
} from "reactn";
import {
  TouchableWithoutFeedback,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";

export const BottomContext = createContext({
  scrollable: false,
  setScrollable: () => {},
});

export default function BottomDrawer({ children, closeModal }) {
  const [theme] = useGlobal("theme");
  const bottomDrawerRef = useRef(null);
  const [scrollable, setScrollable] = useState(true);
  useEffect(() => {
    bottomDrawerRef.current.snapTo(1);
  }, []);

  function close() {
    bottomDrawerRef.current.snapTo(0);

    closeModal();
  }

  const actualContextValues = { scrollable, setScrollable };
  const modalSheetStyle = {
    padding: 15,
    backgroundColor: theme.dark,
  };
  return (
    <View flex={1}>
      <BottomSheet
        enabledContentGestureInteraction={false}
        enabledContentTapInteraction={false}
        borderRadius={10}
        ref={bottomDrawerRef}
        snapPoints={[0, "60%"]}
        onCloseEnd={close}
        renderContent={() => (
          <BottomContext.Provider value={actualContextValues}>
            <ScrollView
              scrollEnabled={scrollable}
              contentContainerStyle={modalSheetStyle}
            >
              {children}
            </ScrollView>
          </BottomContext.Provider>
        )}
      />
      <TouchableWithoutFeedback onPress={close}>
        <View style={styles.fullScreenTranslucent} />
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenTranslucent: {
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
  },
});
