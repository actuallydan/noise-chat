import React from "react";
import { StyleSheet, View, Text, Platform, Image } from "react-native";
import Day from "./Day";
import dayjs from "dayjs";
import { SvgUri } from "react-native-svg";

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

  // Determine if we need to display the current day
  let showDay = true;
  if (
    previousMessage.createdAt &&
    new Date(currentMessage.createdAt).toLocaleDateString() ===
      new Date(previousMessage.createdAt).toLocaleDateString()
  ) {
    showDay = false;
  }

  return (
    <View style={styles.messageWrapper}>
      {showDay && (
        <Day text={new Date(currentMessage.createdAt).toLocaleDateString()} />
      )}
      <View
        style={[
          styles.messageAvatarAndContentWrapper,
          showAvatar ? { marginTop: 5 } : {},
        ]}
      >
        {showAvatar ? (
          <View style={styles.avatarWrapper}>
            {Platform.OS === "web" ? (
              <Image
                source={{ uri: currentMessage.user.avatar }}
                style={styles.messageAvatar}
              />
            ) : (
              <SvgUri
                uri={currentMessage.user.avatar}
                style={styles.messageAvatar}
              />
            )}
          </View>
        ) : (
          <View style={styles.avatarWrapperEmpty} />
        )}
        <View>
          {showAvatar && (
            <View style={styles.userAndTimeWrapper}>
              <Text style={styles.messageUserText}>
                {currentMessage.user.name}
              </Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
          )}
          <Text style={styles.messageText}>{currentMessage.text}</Text>
        </View>
      </View>
    </View>
  );
};

export default Message;

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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  messageWrapper: {
    marginHorizontal: 15,
  },
  messageUserText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
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
    color: "#000000",
    paddingVertical: 0,
    paddingRight: 15,

    fontSize: 15,
  },
  timestamp: {
    color: "#000000b7",
    fontWeight: "300",
    fontSize: 14,
    marginLeft: 10,
  },
});
