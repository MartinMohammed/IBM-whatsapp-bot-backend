import { Server, Socket, Namespace } from "socket.io";

// ------------------------ FOR "/" ------------------------
/** Define how an event is defined, including the event name and the callback structure */
export type ServerToClientEventsType = {};

/** Define the client-to-server event types */
export type ClientToServerEventsType = {};

/** Define the inter-server event types (empty in this case) */
export type InterServerEventsType = {};

/** Enables us to append / add data to the active socket connection */
export type SocketDataType = {};
// ------------------------ FOR "/" ------------------------

/** Represents the different types of socket connections we can receive, where each namespace corresponds to a different socket connection. */
export enum AllNamespaces {
  ROOT = "/root",
  /** Represents the socket namespace used for real-time transfer of WhatsApp messages. */
  MESSAGES = "/messages",
}

/** The actions that can be applied to every namespace and room */
export type RootServer = Server<
  ClientToServerEventsType,
  ServerToClientEventsType,
  InterServerEventsType,
  SocketDataType
>;

/** The Socket generic type represents an individual socket connection within a specific namespace.
 * It defines the event types that can be emitted and received on that socket connection, as well as the data payload structure for those events.
 */
export type RootSocket = Socket<
  ClientToServerEventsType,
  ServerToClientEventsType,
  InterServerEventsType,
  SocketDataType
>;

/** The Namespace generic type represents a collection of socket connections within a specific namespace.
 * It defines the event types that can be emitted and received across all the socket connections within that namespace.
 */
export type RootNamespace = Namespace<
  ClientToServerEventsType,
  ServerToClientEventsType,
  InterServerEventsType,
  SocketDataType
>;

/** Represents the available namespaces in the application. */
export type AllNamespacesType = AllNamespaces.ROOT | AllNamespaces.MESSAGES;
