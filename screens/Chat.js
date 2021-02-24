import React, {
  useState,
  useEffect,
  useGlobal,
  useRef,
  useCallback,
} from "reactn";
import { Platform, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";
import { uuid } from "../utils/common";

import firebase, { firebaseConfig } from "../utils/firebase";
import flatten from "lodash.flatten";
import dayjs from "dayjs";
import Message from "../components/Message";
import Screen from "../components/Screen";
import IconButton from "../components/IconButton";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Type from "../components/Type";
import BigInput from "../components/BigInput";

import { useAuthState } from "react-firebase-hooks/auth";
import Button from "../components/Button";
import LocationHeader from "../components/LocationHeader";

const LINE_HEIGHT = 25;

export default function Chat({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [location] = useGlobal("location");

  // user returned from hook is read-only so that's why we need this bass-ackwards pageantry mis-direction
  const [firebaseUser] = useAuthState(firebase.auth());

  let user = null;
  // if the user isn't logged in, give the app some default data
  if (!firebaseUser) {
    user = {
      displayName: "",
      photoURL: "person-circle-sharp",
      uid: "",
    };
  } else {
    user = firebaseUser;
  }

  const [messagesObj, setMessagesObj] = useState({});
  const [theme] = useGlobal("theme");
  const [height, setHeight] = useState(LINE_HEIGHT);
  const [text, setText] = useState("");
  const giftedChatRef = useRef(null);
  const latLongID = location
    ? location.latitude.toFixed(2) + "+" + location.longitude.toFixed(2)
    : "99.99+99.99";

  // example latLongID = 38.93+-77.03

  const ref = firebase.firestore().collection(`/messages/${latLongID}/list`);

  function getArrOfDocs(loc) {
    const [lat, lon] = loc.split("+").map((l) => parseFloat(l));

    return [
      [lat - 0.01, lon - 0.01],
      [lat, lon - 0.01],
      [lat + 0.01, lon - 0.01],
      [lat - 0.01, lon + 0.01],
      [lat, lon],
      [lat + 0.01, lon],
      [lat, lon + 0.01],
      [lat - 0.01, lon],
      [lat + 0.01, lon + 0.01],
    ]
      .map((p) => p.map((f) => f.toFixed(2)).join("+"))
      .sort();
  }

  // Boy howdy this bit is DENSE
  useEffect(() => {
    // Get all the messages as an object of {tileId: messages[], tileId:message[]}
    // Flatten them with lodash because CoreJS doesn't have Array.flat() :eyeroll
    const flattenedTempMessages = flatten(Object.values(messagesObj));

    // Sort them by unix timestamp
    const sortedMessages = flattenedTempMessages.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );

    // Update our messages array
    setMessages(sortedMessages);
  }, [messagesObj]);

  useEffect(() => {
    // setup listen hook for queries in firestore +/- 1 lat long minute
    const arrOfLocs = getArrOfDocs(latLongID);

    // The return value should be an array of unsubscribe functions
    const unsubs = arrOfLocs.map((loc) => {
      return firebase
        .firestore()
        .collection(`/messages/${loc}/list`)
        .orderBy("createdAt", "desc")
        .limit(50)
        .onSnapshot((querySnapshot) => {
          let msgs = [];

          if (querySnapshot) {
            querySnapshot.forEach((doc) => {
              msgs.push(doc.data());
            });
          }

          // Since the documents (messages) resolve to data asynchronously, use the resolver pattern to not overwrite other updates
          setMessagesObj((oldMessagesObj) => ({
            ...oldMessagesObj,
            [loc]: msgs,
          }));

          // on new message scroll to footer Ref
          if (giftedChatRef.current) {
            giftedChatRef.current.scrollToBottom();
          }
        });
    });

    // I'm not totally sure this works this way, but try to unsub from all the listeners at once?
    return () => unsubs.forEach((u) => u());
  }, [latLongID]);

  function onSend(messages = []) {
    messages.forEach((m) => {
      if (m.text.trim() === "") {
        return;
      }
      const newObj = {
        ...m,
        lat: location.latitude,
        long: location.longitude,
        createdAt: new Date().toJSON(),
      };

      // optimisticaly update UI to append our new message while it uploads
      // const newTempMessages = messages;
      // newTempMessages.push(newObj);
      // setMessages(newTempMessages);

      // instead of using .doc(newID).set(data) we could have used .add(data), but then we wouldn't ahve control of it's ID
      ref.doc(m._id).set(newObj);
    });
  }

  function renderComposer(props) {
    // const onInputSizeChanged = ({ height }) => {
    //   height = Math.round(height / LINE_HEIGHT) * LINE_HEIGHT;
    //   // enforce max composer height
    //   if (height < 150) {
    //     setHeight(height);
    //   }
    // };
    const _onSend = () => {
      const newMessage = {
        _id: uuid(),
        user: {
          _id: user.uid,
          name: user.displayName || "",
          avatar: user.photoURL,
        },
        text,
      };
      onSend([newMessage]);
      setText("");
    };
    return (
      // <Composer
      //   // {...props}
      //   onSend={_onSend}
      //   placeholderTextColor={theme.accent + "99"}
      //   placeholder="Type Message..."
      //   onInputSizeChanged={onInputSizeChanged}
      //   composerHeight={text.trim() === "" ? LINE_HEIGHT : height}
      //   underlineColorAndroid={"transparent"}
      //   textInputStyle={{
      //     fontFamily: "Atkinson-Hyperlegible",
      //     borderWidth: 0,
      //     textAlignVertical: "center",
      //     fontSize: Platform.OS === "android" ? 16 : 20,
      //     lineHeight: LINE_HEIGHT,
      //     color: theme.accent,
      //     justifyContent: "center",
      //   }}
      // />
      <BigInput
        value={text}
        onChangeText={setText}
        onPress={_onSend}
        placeholderTextColor={theme.accent + "99"}
        placeholder="Type Message..."
      />
    );
  }

  function renderSend(props) {
    const onSend = () => {
      props.onSend({ text: props.text.trim() }, true);
    };
    return (
      <IconButton
        onPress={onSend}
        name="chevron-forward-sharp"
        size={LINE_HEIGHT}
        lightMode={props.text}
        disabled={!props.text}
      />
    );
  }
  function renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === "android" ? 34 : 30,
      };
    }

    return (
      <Message key={props.id} {...props} messageTextStyle={messageTextStyle} />
    );
  }

  function renderLoading(loadingText = "Connecting...") {
    return (
      <View style={styles.centerCenterColumn}>
        <Loader size={30} />
        <Type>{loadingText}</Type>
      </View>
    );
  }

  function renderChatEmpty() {
    return (
      <View style={[styles.centerCenterColumn, styles.flexGrow1]}>
        <IconButton
          name={"chatbubble-ellipses-sharp"}
          size={45}
          border={false}
        />
        <Type style={{ textAlign: "center" }}>
          Looks like there aren't any messages around you...yet.
        </Type>
      </View>
    );
  }

  function renderNotLoggedIn() {
    return (
      <View style={styles.centerBetweenRow}>
        <Button onPress={goToAuth}>Start</Button>
        <Button onPress={goToSignInWithPhone}>Login</Button>
      </View>
    );
  }

  const goToSettings = useCallback(() => {
    user.displayName && navigation.navigate("settings");
  }, [navigation, user]);

  const goToAuth = () => {
    navigation.navigate("auth");
  };
  const goToSignInWithPhone = () => {
    navigation.navigate("linkPhone");
  };
  return (
    <Screen style={{ justifyContent: "flex-end" }}>
      <Header onPress={goToSettings} topIcon={"filter-sharp"} />
      <LocationHeader locationID={latLongID} onPress={goToSettings} />
      {!location ? (
        renderLoading("Getting your location...")
      ) : messages.length === 0 ? (
        renderChatEmpty()
      ) : (
        <View style={styles.flexGrow1}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
              _id: user.uid,
              name: user.displayName || "",
              avatar: user.photoURL,
            }}
            ref={(ref) => (giftedChatRef.current = ref)}
            renderMessage={renderMessage}
            renderInputToolbar={() => {
              <View style={{ height: 0, width: 0 }}></View>;
            }}
            renderComposer={() => {
              <View style={{ height: 0, width: 0 }}></View>;
            }}
            renderSend={renderSend}
            renderLoading={renderLoading}
            messagesContainerStyle={styles.paddingForHeader}
          />
        </View>
      )}
      {user?.displayName ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : "height"}
        >
          {renderComposer()}
        </KeyboardAvoidingView>
      ) : (
        renderNotLoggedIn()
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerCenterColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  flexGrow1: { flexGrow: 1 },
  centerBetweenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paddingForHeader: { paddingTop: 25, flexGrow: 1 },
});
