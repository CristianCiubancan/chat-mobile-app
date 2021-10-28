import { ApolloProvider } from "@apollo/client";
import * as React from "react";
import { NavigationWrapper } from "./navigation/navigationWrapper";
import { client } from "./utils/apolloClient";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationWrapper />
    </ApolloProvider>
  );
};
export default App;
