import React, { useState, useEffect, useGlobal } from "reactn";
import { Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";

import SlackMessage from "../components/SlackMessage";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [location] = useGlobal("location");

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer!!!",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  function onSend(messages = []) {
    messages = messages.map((m) => ({ ...m, ...location }));
    console.log(messages);
    setMessages((oldMessages) => GiftedChat.append(oldMessages, messages));
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

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />;
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
