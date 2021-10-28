import * as React from "react";
import { View, Pressable, Text, ScrollView } from "react-native";
import { Avatar } from "react-native-elements";
import { useGetUserChatsQuery } from "../../generated/graphql";
import Spinner from "../../modules/shared/spinner";
import { widthAndHeight } from "../../utils/deviceDimensions";
import { getChatWithName } from "../../utils/getChatWithName";
import { getMessageDate } from "../../utils/getMessageDate";
import hasUserReadTheChat from "../../utils/hasUserReadTheChat";

export const ChatsList = ({ navigation, route }: any) => {
  const userId = route.params.userId;
  const { width } = widthAndHeight();
  const { data, loading } = useGetUserChatsQuery();
  return !data ? (
    <Spinner />
  ) : (
    <ScrollView style={{ flex: 1 }}>
      {data?.getUserChats.map((chat) => {
        if (!chat.lastMessage) {
          return null;
        }
        const userChatWithName = getChatWithName(chat, userId);
        const isChatRead = hasUserReadTheChat(chat, userId);
        return (
          <Pressable
            key={chat.id}
            onPress={() => {
              navigation.navigate("Chat", { chatId: chat.id });
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "#B2F5EA"
                  : isChatRead
                  ? "#E2E8F0"
                  : "#EBF8FF",
              },
              {
                paddingHorizontal: 15,
                paddingVertical: 20,
                marginTop: 10,
                marginHorizontal: 10,
                borderWidth: isChatRead ? 0 : 1,
              }, //other stiles
            ]}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}>
                <Avatar
                  rounded
                  source={{ uri: userChatWithName.profilePic }}
                  size={50}
                />
                <View
                  style={{
                    marginHorizontal: 10,
                    maxWidth: width * 0.6,
                  }}>
                  <Text
                    style={{
                      color: "#F687B3",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}>
                    {userChatWithName.name}
                  </Text>
                  <Text numberOfLines={1}>
                    {chat.lastMessage?.senderId === userId ? (
                      <Text
                        style={{
                          fontWeight: "normal",
                          fontSize: 16,
                        }}>
                        {`You: `}
                      </Text>
                    ) : null}
                    <Text
                      style={{
                        fontWeight: "normal",
                        fontSize: 20,
                      }}>
                      {chat.lastMessage?.text}
                    </Text>
                  </Text>
                </View>
              </View>
              <Text style={{ paddingBottom: 4.5 }}>
                {getMessageDate(chat.lastMessage?.createdAt)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
