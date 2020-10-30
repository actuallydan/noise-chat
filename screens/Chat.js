import React, { useState, useEffect, useGlobal } from "reactn";
import { Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";

import firebase from "firebase/app";
import "@firebase/firestore";
import flatten from "lodash.flatten";
import dayjs from "dayjs";
import SlackMessage from "../components/SlackMessage";
import Message from "../components/Message";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [location] = useGlobal("location");
  const [user] = useGlobal("user");
  const [messagesObj, setMessagesObj] = useState({});

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

          // Since the docs resolve to data asynchronously, use the resolver pattern to not overwrite other updates
          setMessagesObj((oldMessagesObj) => ({
            ...oldMessagesObj,
            [loc]: msgs,
          }));
        });
    });

    // I'm not totally sure this works this way, but try to unsub from all the listeners at once?
    return () => unsubs.forEach((u) => u());
  }, []);

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async function onSend(messages = []) {
    messages = messages.map(async (m) => {
      // const newID = uuidv4();
      const newObj = {
        ...m,
        lat: location.latitude,
        long: location.longitude,
        createdAt: new Date().toJSON(),
      };

      console.log({ newObj });
      // instead of using .doc(newID).set(data) we could have used .add(data), but then we wouldn't ahve control of it's ID
      await ref.doc(m._id).set(newObj);

      return newObj;
    });

    // save in firestore

    //     createdAt: t {seconds: 1603684800, nanoseconds: 0}
    // id: "sd87f6b9sdf"
    // lat: 38.93
    // long: -77.02
    // text: "test"
    // user: "s8d7f65v8s7d65f"

    // setMessages((oldMessages) => GiftedChat.append(oldMessages, messages));
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
      // <SlackMessage
      //   key={props.id}
      //   {...props}
      //   messageTextStyle={messageTextStyle}
      // />
      <Message key={props.id} {...props} messageTextStyle={messageTextStyle} />
    );
  }

  // console.log(messagesObj);
  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: user.id,
        name: user.name || "",
        avatar: user.avatar,
      }}
      renderMessage={renderMessage}
    />
  );
}
