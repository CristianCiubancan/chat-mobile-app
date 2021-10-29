import * as React from "react";
import { AppState } from "react-native";
import { Navigation } from ".";
import { useMeQuery } from "../generated/graphql";
import { activeSocket, client } from "../utils/apolloClient";

export const NavigationWrapper = () => {
  const { data, loading } = useMeQuery();

  const forceUpdate = async (newState: any) => {
    const sock = activeSocket;
    if (newState === "background") {
      if (sock) await sock.close(1000, "normal closure");
    }
    if (newState === "active") {
      // if (sock && sock.readyState === WebSocket.OPEN) {
      //   await client.refetchQueries({ include: "active" });
      // }
      client.refetchQueries({ include: "active" });
      if (sock && sock.readyState === WebSocket.CLOSED) {
        await sock.close(4205, "Client Restart");
      }
    }
  };

  React.useEffect(() => {
    AppState.addEventListener("change", forceUpdate);
    return () => AppState.addEventListener("change", forceUpdate).remove();
  }, []);

  return loading ? null : <Navigation userId={data?.me?.id} />;
};
