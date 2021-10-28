import * as React from "react";
import { View, Text } from "react-native";
import { useMeQuery } from "../../generated/graphql";

export const Me = () => {
  const { data, loading } = useMeQuery();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{!loading ? data?.me?.username : null}</Text>
    </View>
  );
};
