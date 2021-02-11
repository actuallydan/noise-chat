import React, {
  useState,
  useEffect,
  useGlobal,
  useRef,
  useContext,
} from "reactn";
import { Platform, View } from "react-native";
import { GiftedChat, Composer, InputToolbar } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";
import { ThemeContext } from "../utils/theme";

import firebase from "../utils/firebase";
import flatten from "lodash.flatten";
import dayjs from "dayjs";
import Message from "../components/Message";
import Screen from "../components/Screen";
import IconButton from "../components/IconButton";

const LINE_HEIGHT = 25;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [location] = useGlobal("location");
  const [user] = useGlobal("user");
  const [messagesObj, setMessagesObj] = useState({});
  const [text, setText] = useState("");
  const theme = useContext(ThemeContext);
  const [height, setHeight] = useState(LINE_HEIGHT);

  const giftedChatRef = useRef(null);
  const latLongID =
    location.latitude.toFixed(2) + "+" + location.longitude.toFixed(2);

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
    // Flatten them with lodash because CoreJS doesn't have flat() :eyeroll
    const flattenedTempMessages = flatten(Object.values(messagesObj));

    // Sort them by unix timestamp
    const sortedMessages = flattenedTempMessages.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );

    // Update our messages array
    GiftedChat.append([], sortedMessages);
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
  }, []);

  async function onSend(messages = []) {
    messages.forEach(async (m) => {
      if (m.text.trim() === "") {
        return;
      }
      // const newID = uuidv4();
      const newObj = {
        ...m,
        lat: location.latitude,
        long: location.longitude,
        createdAt: new Date().toJSON(),
      };

      // instead of using .doc(newID).set(data) we could have used .add(data), but then we wouldn't ahve control of it's ID
      await ref.doc(m._id).set(newObj);
    });

    // save in firestore

    //     createdAt: t {seconds: 1603684800, nanoseconds: 0}
    // id: "sd87f6b9sdf"
    // lat: 38.93
    // long: -77.02
    // text: "test"
    // user: "s8d7f65v8s7d65f"
  }

  function renderComposer(props) {
    const onInputSizeChanged = ({ height }) => {
      height = Math.round(height / LINE_HEIGHT) * LINE_HEIGHT;
      // enforce max composer height
      if (height < 150) {
        setHeight(height);
      }
    };
    return (
      <Composer
        {...props}
        placeholderTextColor={theme.accent + "99"}
        placeholder="Type Message..."
        onInputSizeChanged={onInputSizeChanged}
        composerHeight={props.text.trim() === "" ? LINE_HEIGHT : height}
        underlineColorAndroid={"transparent"}
        textInputStyle={{
          fontFamily: "Atkinson-Hyperlegible",
          borderWidth: 0,
          textAlignVertical: "center",
          fontSize: 16,
          lineHeight: LINE_HEIGHT,
          color: theme.accent,
        }}
      />
    );
  }
  function renderInputToolbar({ children, ...props }) {
    const containerStyle = {
      borderColor: theme.accent,
      backgroundColor: theme.dark,
      marginVertical: 5,
      borderWidth: 3,
      borderRadius: 10,
      padding: 8,
      borderTopColor: theme.accent,
      borderTopWidth: 3,
      flexDirection: "row",
      alignItems: "center",
      // something needs to be done here to make it run on web...
    };
    return (
      <InputToolbar
        nativeID="uguhguh"
        {...props}
        containerStyle={containerStyle}
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

  return (
    <Screen>
      <View
        style={{
          // height: 20,
          flexDirection: "row",
          alignItems: "center",
          // backgroundColor: "#00000090",
          position: "absolute",
          top: 5,
          left: 10,
          zIndex: 2,
          // width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: theme.dark,
            borderRadius: 9999,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton name="filter-sharp" lightMode round size={35} />
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.id,
          name: user.name || "",
          avatar: user.avatar,
        }}
        renderFooter={() => <View style={{ height: 30 }}></View>}
        ref={(ref) => (giftedChatRef.current = ref)}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        messagesContainerStyle={{ paddingTop: 25 }}
      />
    </Screen>
  );
}
