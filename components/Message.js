import React, { memo } from "react";
import { StyleSheet, View, Text } from "react-native";
import Day from "./Day";
import dayjs from "dayjs";
import Type from "./Type";
import Card from "./Card";
import SmallType from "./SmallType";
import IconButton from "./IconButton";
import emojiUtils from "emoji-utils";

const Message = ({ currentMessage, previousMessage = {}, ...props }) => {
  const timestamp = dayjs(currentMessage.createdAt).format("LT");

  // Determine if we need to display the user's avatar
  let showAvatar = true;

  if (
    previousMessage.user &&
    currentMessage.user._id === previousMessage.user._id
  ) {
    showAvatar = false;
  }

  // Does this message belong to the current user?
  let isMine = false;
  if (currentMessage.user._id === props.user._id) {
    isMine = true;
  }

  // Determine if we need to display the current day
  let showDay = true;
  if (
    previousMessage.createdAt &&
    new Date(currentMessage.createdAt).toLocaleDateString() ===
      new Date(previousMessage.createdAt).toLocaleDateString()
  ) {
    showDay = false;
  }

  const messageAvatarAndContentWrapperStyle = [
    styles.messageAvatarAndContentWrapper,
    showAvatar ? { marginTop: 5 } : {},
    isMine ? { flexDirection: "row-reverse" } : {},
  ];

  const userAndTimeWrapperStyle = [
    styles.userAndTimeWrapper,
    isMine ? { flexDirection: "row-reverse" } : {},
  ];

  const messageUserTextStyle = isMine
    ? { marginLeft: 10 }
    : { marginRight: 10 };
  return (
    <View style={styles.messageWrapper}>
      {showDay && (
        <Day text={new Date(currentMessage.createdAt).toLocaleDateString()} />
      )}
      <View style={messageAvatarAndContentWrapperStyle}>
        {showAvatar ? (
          <View style={styles.avatarWrapper}>
            <IconButton name={currentMessage.user.avatar} lightMode={isMine} />
          </View>
        ) : (
          <View style={styles.avatarWrapperEmpty} />
        )}
        <View style={styles.flexShrink}>
          {showAvatar && (
            <View style={userAndTimeWrapperStyle}>
              <Type style={messageUserTextStyle}>
                {currentMessage.user.name}
              </Type>
              <SmallType>{timestamp}</SmallType>
            </View>
          )}
          {emojiUtils.isPureEmojiString(currentMessage.text) ? (
            <Text
              style={{ fontSize: 45, textAlign: isMine ? "right" : "left" }}
            >
              {currentMessage.text}
            </Text>
          ) : (
            <Card lightMode={isMine}>
              <Type lightMode={isMine}>{currentMessage.text}</Type>
            </Card>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(Message);

const styles = StyleSheet.create({
  messageAvatarAndContentWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  messageContentWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  userAndTimeWrapper: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  messageWrapper: {},
  avatarWrapper: {
    height: 40,
    width: 40,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarWrapperEmpty: {
    height: 0,
    width: 40,
  },
  messageAvatar: {
    height: 30,
    width: 30,
  },
  messageText: {
    paddingVertical: 0,
    paddingRight: 15,
    fontSize: 15,
  },
  timestamp: {
    fontWeight: "300",
    fontSize: 14,
    marginLeft: 10,
  },
  flexShrink: { flexShrink: 1 },
});
