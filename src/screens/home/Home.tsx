import * as React from "react";
import { ScrollView, View } from "react-native";
import {
  useCreateChatMutation,
  useGetUsersQuery,
} from "../../generated/graphql";
import Spinner from "../../modules/shared/spinner";
import { Avatar, Button, Icon, Text } from "react-native-elements";

export const Home = ({ navigation, route }: any) => {
  const userId = route.params.userId;
  const { data, loading } = useGetUsersQuery();
  const [startChat] = useCreateChatMutation({
    onCompleted: (data) => {
      navigation.navigate("Chat", { chatId: data?.createChat.id });
    },
  });
  return loading ? (
    <Spinner />
  ) : (
    <ScrollView style={{ flex: 1, width: "100%", marginBottom: 20 }}>
      {data?.getUsers.map((user) => (
        <View
          key={user.id}
          style={{
            marginTop: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            padding: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Avatar rounded source={{ uri: user.profilePicUrl }} size={50} />
            <Text
              style={{
                color: "#F687B3",
                fontWeight: "bold",
                fontSize: 20,
                marginLeft: 10,
              }}>
              {user.username.length > 20
                ? ` ${user.username.slice(0, 20)}...`
                : ` ${user.username}`}
            </Text>
          </View>
          <Button
            buttonStyle={{ backgroundColor: "#008080" }}
            onPress={() => {
              if (userId) {
                startChat({
                  variables: {
                    initiatorId: userId,
                    otherMemberId: user.id,
                  },
                });
              }
            }}
            icon={
              <Icon
                tvParallaxProperties
                name="chatbox-outline"
                type="ionicon"
                size={25}
                color="white"
              />
            }
            iconRight
          />
        </View>
      ))}
    </ScrollView>
  );
};
