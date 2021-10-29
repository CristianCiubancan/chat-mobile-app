import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  Operation,
  split,
} from "@apollo/client";
import { print } from "graphql";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition, Observable } from "@apollo/client/utilities";
import { host } from "../modules/shared/constants";
import { Client, ClientOptions, createClient } from "graphql-ws";
import ws from "isomorphic-ws";

class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            console.log(err);
            // if (err instanceof Error) {
            //   return sink.error(err);
            // }
            // if (err instanceof CloseEvent) {
            //   return sink.error(
            //     // reason will be available on clean closes
            //     new Error(
            //       `Socket closed with event ${err.code} ${err.reason || ""}`
            //     )
            //   );
            // }
            // return sink.error(
            //   new Error(
            //     (err as GraphQLError[]).map(({ message }) => message).join(", ")
            //   )
            // );
          },
        }
      );
    });
  }
}

export let activeSocket: any;
// export let timedOut: any;

export const webSocketLink = () => {
  // let pingSentAt = 0,
  //   timedOut,
  //   latency = 0;

  return new WebSocketLink({
    url: `ws://192.168.100.3:4000/graphql` as string,
    keepAlive: 10000,
    on: {
      opened: (socket: any) => {
        client.refetchQueries({ include: "active" });
        activeSocket = socket;
      },
      // ping: (received) => {
      //   console.log(received);
      //   if (!received /* sent */) {
      //     pingSentAt = Date.now();
      //     timedOut = setTimeout(() => {
      //       if (activeSocket.readyState === WebSocket.OPEN) {
      //         activeSocket.close(4408, "Request Timeout");
      //       }
      //     }, 5000); // wait 5 seconds for the pong and then close the connection
      //   }
      // },
      // pong: (received) => {
      //   if (received) {
      //     console.log("pong log");
      //     latency = Date.now() - pingSentAt;
      //     clearTimeout(timedOut); // pong is received, clear connection close timeout
      //   }
      // },
      error: (err) => {
        console.log(err);
      },
    },
    webSocketImpl: ws,
  });
};

const uploadLink = () =>
  createUploadLink({
    uri: `${host}/graphql` as string,
  });

let splitLink = () =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    webSocketLink(),
    uploadLink()
  );

export const client = new ApolloClient({
  ssrMode: typeof window === "undefined",

  link: typeof window === "undefined" ? uploadLink() : splitLink(),
  cache: new InMemoryCache({
    typePolicies: {
      Subscription: {
        fields: {
          newMessagesSentToChat: {
            keyArgs: false,
            merge(existing, incoming, { cache, readField }) {
              cache.modify({
                fields: {
                  getUserChats(existingUserChats = [], { readField }) {
                    let didUpdate = false;
                    if (!existingUserChats) {
                      return [incoming];
                    }
                    const newArray = existingUserChats.map((chatRef: any) => {
                      if (
                        JSON.stringify(incoming) === JSON.stringify(chatRef)
                      ) {
                        didUpdate = true;
                      } else {
                        return chatRef;
                      }
                    });
                    if (didUpdate) {
                      return [incoming, ...newArray];
                    } else {
                      return [incoming, ...newArray];
                    }
                  },
                },
              });
            },
          },
          newReadMessage: {
            keyArgs: false,
            merge(existing, incoming, { cache, readField }) {
              cache.modify({
                fields: {
                  getUserChats(existingUserChats = [], { readField }) {
                    let didUpdate = false;

                    if (!existingUserChats) {
                      return [incoming];
                    }

                    const newArray = existingUserChats.map((chatRef: any) => {
                      if (
                        JSON.stringify(incoming) === JSON.stringify(chatRef)
                      ) {
                        didUpdate = true;
                        return incoming;
                      } else {
                        return chatRef;
                      }
                    });

                    if (didUpdate) {
                      return newArray;
                    } else {
                      return existingUserChats;
                    }
                  },
                },
              });
            },
          },
          newChatMessage: {
            keyArgs: ["chatId"],
            merge(existing, incoming, { cache, readField }) {
              cache.modify({
                fields: {
                  getMessages(existingMessages = [], { readField }) {
                    return {
                      ...existingMessages,
                      messages: [incoming, ...existingMessages.messages],
                    };
                  },
                },
              });
            },
          },
        },
      },
      Query: {
        fields: {
          getMessages: {
            keyArgs: ["chatId"],
            merge(existing, incoming, { args }) {
              if (!incoming) {
                return [];
              }
              if (!existing || !args?.cursor) {
                return incoming;
              }
              if (args.cursor) {
                return {
                  ...incoming,
                  messages: [
                    ...(existing?.messages || []),
                    ...incoming.messages,
                  ],
                };
              }
            },
          },
        },
      },
    },
  }),
});
