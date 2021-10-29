import * as React from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import {
  useGetChatQuery,
  useGetMessagesQuery,
  useNewChatMessageSubscription,
  useReadChatMessageMutation,
} from "../../generated/graphql";
import MessageInput from "../../modules/messageInput/messageInput";
import { NotificationsButton } from "../../modules/notificationsButton/notificationsButton";
import { teal_dark } from "../../modules/shared/constants";
import Spinner from "../../modules/shared/spinner";

export const Chat = ({ route, navigation }: any) => {
  const userId = route.params.userId;
  const path = route.name;
  const chatId = parseInt(route.params.chatId);

  useGetChatQuery({
    variables: {
      id: chatId,
    },
    onCompleted: (data) => {
      data?.getChat?.members.map((member) => {
        if (member.id !== userId) {
          navigation.setOptions({
            title: member.username,
            headerRight: () => (
              <View style={{ display: "flex", flexDirection: "row" }}>
                <NotificationsButton
                  navigation={navigation}
                  path={path}
                  chatId={chatId}
                  route={route}
                />
                <Avatar rounded source={{ uri: member.profilePicUrl }} />
              </View>
            ),
            headerRightContainerStyle: { paddingRight: 15 },
          });
        }
      });
    },
  });

  const [readChat] = useReadChatMessageMutation();

  const {
    data: messagesData,
    loading: messagesLoading,
    fetchMore,
    networkStatus,
  } = useGetMessagesQuery({
    variables: {
      chatId,
      limit: 15,
      cursor: null,
    },
    onCompleted: (data) => {
      if (data.getMessages?.messages[0]) {
        let isChatRead = false;
        for (let reader of data.getMessages?.messages[0].readersInfo.readers) {
          if (reader.reader.id === userId) {
            isChatRead = true;
          }
        }
        if (isChatRead === false) {
          readChat({
            variables: {
              messageId: parseInt(data.getMessages.messages[0].id),
            },
            refetchQueries: ["UserNotifications"],
          });
        }
      }
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  useNewChatMessageSubscription({
    shouldResubscribe: true,
    variables: { chatId },
    onSubscriptionData: (data) => {
      if (
        data.subscriptionData.data?.newChatMessage.id &&
        data.subscriptionData.data.newChatMessage.senderId !== userId
      )
        readChat({
          variables: {
            messageId: parseInt(data.subscriptionData.data?.newChatMessage.id),
          },
        });
    },
  });

  return !messagesData ? (
    <Spinner />
  ) : (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messagesData?.getMessages?.messages}
        onEndReached={() => {
          if (
            messagesData?.getMessages?.hasMore &&
            networkStatus !== 3 &&
            networkStatus !== 1
          ) {
            fetchMore({
              variables: {
                limit: 15,
                cursor:
                  messagesData?.getMessages?.messages[
                    messagesData.getMessages.messages.length - 1
                  ].createdAt,
              },
            });
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View
            style={{
              marginLeft: item.senderId === userId ? "auto" : 5,
              marginRight: item.senderId === userId ? 5 : "auto",
              backgroundColor: item.senderId === userId ? "#319795" : "white",
              margin: 4,
              padding: 10,
              borderRadius: 7,
              maxWidth: "90%",
              borderColor: item.senderId === userId ? teal_dark : "#319795",
              borderWidth: 1,
            }}>
            {item.senderId === userId ? (
              <Text style={{ color: "white" }}>{item.text}</Text>
            ) : (
              <Text style={{ color: "black" }}>{item.text}</Text>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        inverted
      />
      <MessageInput chatId={chatId} />
    </View>
  );
};
