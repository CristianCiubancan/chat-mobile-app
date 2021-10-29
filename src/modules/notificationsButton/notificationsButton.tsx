import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Icon, Button, Badge } from "react-native-elements";
import {
  GetUserChatsDocument,
  NewNotificationReceivedDocument,
  useNewMessagesSentToChatSubscription,
  useNewReadMessageSubscription,
  useUserNotificationsQuery,
} from "../../generated/graphql";
import { client } from "../../utils/apolloClient";

interface NotificationsButtonProps {
  navigation: any;
  route: any;
  path?: string | undefined;
  chatId?: number | undefined;
}

export const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  navigation,
  path,
  route,
  chatId,
}) => {
  const { data: notificationsData, subscribeToMore } =
    useUserNotificationsQuery();

  const [currentScreenIsChat, setCurrentScreenIsChat] = useState(false);

  const areWeOnChatPage = () => {
    for (let arg of navigation.getState().routeNames) {
      if (arg === "Chat") {
        setCurrentScreenIsChat(true);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NewNotificationReceivedDocument,
      updateQuery(prev, { subscriptionData }: any): any {
        const newFeedItem = {
          __typename: "Notification",
          messageId: subscriptionData.data.newNotificationReceived.messageId,
          chatId: subscriptionData.data.newNotificationReceived.chatId,
        };

        if (subscriptionData.data.newNotificationReceived.add === true) {
          if (!subscriptionData.data) return prev;

          if (chatId === newFeedItem.chatId) {
            return prev;
          }
          if (!prev.userNotifications)
            return Object.assign({}, prev, {
              userNotifications: [newFeedItem],
            });

          let newArray = [];

          for (let obj in prev.userNotifications) {
            if (prev.userNotifications[obj].chatId === newFeedItem.chatId) {
            } else {
              newArray.push(prev.userNotifications[obj]);
            }
          }

          return Object.assign({}, prev, {
            userNotifications: [...newArray, newFeedItem],
          });
        }

        if (subscriptionData.data.newNotificationReceived.add === false) {
          let newArray = [];
          for (let obj in prev.userNotifications) {
            if (
              prev.userNotifications[obj as any].chatId === newFeedItem.chatId
            ) {
            } else {
              newArray.push(prev.userNotifications[obj as any]);
            }
          }
          if (newArray.length === 0) {
            return Object.assign({}, prev, {
              userNotifications: null,
            });
          }
          return Object.assign({}, prev, {
            userNotifications: [...newArray],
          });
        }
        if (currentScreenIsChat) {
          client.refetchQueries({ include: [GetUserChatsDocument] });
        }
      },
    });
    return () => unsubscribe();
  }, [chatId ? chatId : null]);

  useEffect(() => {
    areWeOnChatPage();
  }, [notificationsData?.userNotifications]);

  useNewMessagesSentToChatSubscription();

  useNewReadMessageSubscription({
    shouldResubscribe: true,
    onSubscriptionData: (data) => {},
  });

  //   path === "Chat" ? null :
  return path === "Chat" ? null : (
    <View>
      <Button
        onPress={() => {
          navigation.navigate("Chats");
        }}
        buttonStyle={{
          backgroundColor:
            notificationsData?.userNotifications &&
            notificationsData.userNotifications.length > 0
              ? "#D53F8C"
              : "#319795",
        }}
        icon={
          <Icon
            tvParallaxProperties
            name="chatbox-outline"
            type="ionicon"
            size={15}
            color="white"
          />
        }
        iconRight
      />
      {notificationsData?.userNotifications &&
      notificationsData.userNotifications.length > 0 ? (
        <Badge
          value={notificationsData.userNotifications.length}
          status="warning"
          containerStyle={{ position: "absolute", top: -7, right: -7 }}
        />
      ) : null}
    </View>
  );
};
