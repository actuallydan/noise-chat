import React, { useState, useEffect, useGlobal } from "reactn";
import { Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";

import firebase from "firebase/app";
import "@firebase/firestore";

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

  useEffect(() => {
    // setup listen hook for queries in firestore +/- 1 lat long minute
    const arrOfLocs = getArrOfDocs(latLongID);
    const tempObjOfMessages = {};
    arrOfLocs.forEach((loc) => {
      firebase
        .firestore()
        .collection(`/messages/${loc}/list`)
        .orderBy("createdAt", "desc")
        .limit(50)
        .onSnapshot((querySnapshot) => {
          tempObjOfMessages[loc] = [];

          if (querySnapshot) {
            querySnapshot.forEach((doc) => {
              tempObjOfMessages[loc].push(doc.data());
            });
          }
        });

      setMessagesObj(tempObjOfMessages);
    });

    // listen for updates to resource in question
    ref
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot((querySnapshot) => {
        // querySnapshot is an array of documents
        // TODO
        // querySnapshot can be undefined, fruutratingly
        if (querySnapshot) {
          let msgs = [];
          querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            msgs.push(doc.data());
          });

          GiftedChat.append([], msgs);
          setMessages(msgs);
        }
      });

    // setMessages([
    //   {
    //     _id: 1,
    //     text: "Hello developer!!!",
    //     createdAt: new Date().toJSON(),
    //     user: {
    //       _id: 2,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //   },
    // ]);
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

  console.log(messagesObj);
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
