// import {
//   ApolloLink,
//   Operation,
//   FetchResult,
//   Observable,
// } from "@apollo/client/core";
// import { print } from "graphql";
// import { createClient, ClientOptions, Client } from "graphql-ws";
// import { host } from "../modules/shared/constants";

// class WebSocketLink extends ApolloLink {
//   private client: Client;

//   constructor(options: ClientOptions) {
//     super();
//     this.client = createClient(options);
//   }

//   public request(operation: Operation): Observable<FetchResult> {
//     return new Observable((sink) => {
//       return this.client.subscribe<FetchResult>(
//         { ...operation, query: print(operation.query) },
//         {
//           next: sink.next.bind(sink),
//           complete: sink.complete.bind(sink),
//           error: (err) => {
//             // console.log(err);
//             // if (err instanceof Error) {
//             //   return sink.error(err);
//             // }
//             // if (err instanceof CloseEvent) {
//             //   return sink.error(
//             //     // reason will be available on clean closes
//             //     new Error(
//             //       `Socket closed with event ${err.code} ${err.reason || ""}`
//             //     )
//             //   );
//             // }
//             // return sink.error(
//             //   new Error(
//             //     (err as GraphQLError[]).map(({ message }) => message).join(", ")
//             //   )
//             // );
//           },
//         }
//       );
//     });
//   }
// }

// export const webSocketLink = () => {
//   let activeSocket: any,
//     timedOut: any,
//     pingSentAt = 0,
//     latency = 0;

//   return new WebSocketLink({
//     url: `${host}/graphql` as string,
//     keepAlive: 10000,
//     on: {
//       opened: (socket: any) => (activeSocket = socket),
//       ping: (received) => {
//         if (!received /* sent */) {
//           pingSentAt = Date.now();
//           timedOut = setTimeout(() => {
//             if (activeSocket.readyState === WebSocket.OPEN) {
//               console.log("restarting socket");
//               activeSocket.close(4408, "Request Timeout");
//             }
//           }, 5000); // wait 5 seconds for the pong and then close the connection
//         }
//       },
//       pong: (received) => {
//         if (received) {
//           latency = Date.now() - pingSentAt;
//           clearTimeout(timedOut); // pong is received, clear connection close timeout
//         }
//       },
//       error: (err) => {
//         console.log(err);
//       },
//     },
//   });
// };
