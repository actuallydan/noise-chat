import React, { useState, useEffect, useGlobal } from "reactn";
import { Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";

import firebase from "firebase";
import "@firebase/firestore";

import SlackMessage from "../components/SlackMessage";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [location] = useGlobal("location");

  const latLongID =
    location.latitude.toFixed(2) + "" + location.longitude.toFixed(2);
  console.log(latLongID);

  const ref = firebase.firestore().collection(`/messages/${latLongID}/list`);

  useEffect(() => {
    // setup listen hook for queries in firestore +/- 1 lat long minute

    // listen for updates to resource in question
    ref
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot((querySnapshot) => {
        // querySnapshot is an array of documents
        // TODO
        // querySnapshot can be undefined, fruutratingly
        if (querySnapshot) {
          // console.log(querySnapshot)
          let msgs = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
            msgs.push(doc.data());
          });

          GiftedChat.append([], msgs);
          setMessages(msgs);
        }
      });

    // (async () => {
    //   if (ref.get()) {
    //     console.log(
    //       "get data",
    //       await ref.get().data(),
    //       await ref.doc(latLongID).get().data()
    //     );
    //   }
    // })();

    setMessages([
      {
        _id: 1,
        text: "Hello developer!!!",
        createdAt: new Date().toJSON(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
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
    messages = messages.map((m) => {
      return {
        ...m,
        id: uuidv4(),
        lat: location.latitude,
        long: location.longitude,
        user: m.user._id,
        createdAt: new Date().toJSON(),
      };
    });

    console.log(messages);
    // save in firestore

    //     createdAt: t {seconds: 1603684800, nanoseconds: 0}
    // id: "sd87f6b9sdf"
    // lat: 38.93
    // long: -77.02
    // text: "test"
    // user: "s8d7f65v8s7d65f"

    await ref.add(messages[0]);

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
      <SlackMessage
        key={props.id}
        {...props}
        messageTextStyle={messageTextStyle}
      />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: 1,
        name: "Me!",
        avatar: "https://placeimg.com/140/140/any",
      }}
      renderMessage={renderMessage}
    />
  );
}
