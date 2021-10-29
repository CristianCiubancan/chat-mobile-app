import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../../generated/graphql";
import { client } from "../../utils/apolloClient";

export function CustomDrawerContent(props: any) {
  const { data } = useMeQuery();
  const [logout] = useLogoutMutation();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {data?.me?.id ? (
        <DrawerItem
          style={{ marginTop: "auto" }}
          inactiveBackgroundColor="#F4859C"
          inactiveTintColor="white"
          label="Logout"
          onPress={async () => {
            await logout();
            await client.clearStore();
            props.navigation.replace("Home ", {
              screen: "Home",
              params: { chatId: null },
            });
            await client.refetchQueries({ include: [MeDocument] });
          }}
        />
      ) : null}
    </DrawerContentScrollView>
  );
}
