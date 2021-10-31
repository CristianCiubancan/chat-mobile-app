import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { View } from "react-native";
import { Avatar, ListItem, Text } from "react-native-elements";
import {
  GetUsersDocument,
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../../generated/graphql";
import { client } from "../../utils/apolloClient";

export function CustomDrawerContent(props: any) {
  const { data } = useMeQuery();
  const [logout] = useLogoutMutation();
  return (
    <View style={{ height: "100%", paddingVertical: 20 }}>
      {data?.me?.id ? (
        <View
          style={{
            padding: 10,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
          }}>
          <ListItem tvParallaxProperties hasTVPreferredFocus>
            <Avatar
              rounded
              size={80}
              source={{
                uri: data?.me?.profilePicUrl,
              }}
            />
            <ListItem.Content>
              <ListItem.Title
                numberOfLines={1}
                style={{ fontWeight: "600", fontSize: 30, marginTop: 10 }}>
                {data.me.username}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      ) : null}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        {data?.me?.id ? (
          <DrawerItem
            inactiveBackgroundColor="#F4859C"
            inactiveTintColor="white"
            label="Logout"
            onPress={async () => {
              await logout();
              await client.clearStore();
              await client.refetchQueries({
                include: [MeDocument, GetUsersDocument],
              });
              props.navigation.replace("Home ", {
                screen: "Home",
                params: { userId: null },
              });
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
