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

export const webSocketLink = () => {
  return new WebSocketLink({
    url: `ws://192.168.100.3:4000/graphql` as string,
    keepAlive: 10000,
    on: {
      opened: (socket: any) => {
        client.refetchQueries({ include: "active" });
        activeSocket = socket;
      },
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
                    const newArray = [];
                    for (let message of existingMessages.messages) {
                      if (
                        JSON.stringify(message.__ref) ===
                        JSON.stringify(incoming.__ref)
                      ) {
                      } else {
                        newArray.push(message);
                      }
                    }

                    return {
                      ...existingMessages,
                      messages: [incoming, ...newArray],
                    };
                  },
                },
              });
            },
          },
        },
      },
      Mutation: {
        fields: {
          sendMessage: {
            merge(existing, incoming, { cache }) {
              cache.modify({
                fields: {
                  getMessages(existingMessages = [], { readField }) {
                    const newArray = [];
                    for (let message of existingMessages.messages) {
                      if (
                        JSON.stringify(message.__ref) ===
                        JSON.stringify(incoming.__ref)
                      ) {
                      } else {
                        newArray.push(message);
                      }
                    }

                    return {
                      ...existingMessages,
                      messages: [incoming, ...newArray],
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
