import { Socket, Namespace } from "socket.io";
import { RootNamespace, RootSocket } from "./root";
import { IListenerTextMessage } from "node-whatsapp-bot-api";
import { ITextMessageFromClient } from "../client/Messages";

// ------------------------ FOR "/messages" ------------------------
/** Define how an event is defined, including the event name and the callback structure */
export type ServerToClientEventsMessagesType = {
  message: (text: IListenerTextMessage) => void;
};

/** Define the client-to-server event types */
export type ClientToServerEventsMessagesType = {
  message: (text: ITextMessageFromClient) => void;
};

/** Define the inter-server event types (empty in this case) */
export type InterServerEventsMessagesType = {};

/** Enables us to append / add data to the active socket connection */
export type SocketDataMessagesType = {};
// ------------------------ FOR "/messages" ------------------------

/** Represents the type of socket we receive when listening to the socket connection within the "messages" namespace. */
export type MessagesSocket = Socket<
  ClientToServerEventsMessagesType,
  ServerToClientEventsMessagesType,
  InterServerEventsMessagesType,
  SocketDataMessagesType
> &
  RootSocket;

/** Represents the specific namespace that we support and the different events it can receive and emit, as well as the socket data payload. */
export type MessagesNamespace = Namespace<
  ClientToServerEventsMessagesType,
  ServerToClientEventsMessagesType,
  InterServerEventsMessagesType,
  SocketDataMessagesType
> &
  RootNamespace;
