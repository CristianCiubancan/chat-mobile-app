import * as React from "react";
import { AppState } from "react-native";
import { Navigation } from ".";
import { useMeQuery } from "../generated/graphql";
import { client } from "../utils/apolloClient";

export const NavigationWrapper = () => {
  const { data, loading } = useMeQuery();

  const forceUpdate = (newState: any) => {
    if (newState === "active") {
      // client.resetStore();
      client.refetchQueries({ include: "active" });
    } // forces a rerender
  };
  React.useEffect(() => {
    AppState.addEventListener("change", forceUpdate);
    return () => AppState.addEventListener("change", forceUpdate).remove();
  }, []);

  return loading ? null : <Navigation userId={data?.me?.id} />;
};
