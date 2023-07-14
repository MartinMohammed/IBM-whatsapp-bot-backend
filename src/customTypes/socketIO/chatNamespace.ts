import { Socket, Namespace } from "socket.io";
import { RootNamespace, RootSocket } from "./root";
import { IWhatsappTextMessageFromClient, IWhatsappTextMessageFromServer } from "./messages";
import { IUser } from "../models/User";
import { IClientStoredContact } from "./contacts";


// ------------------------ FOR "/messages" ------------------------
/** Defines the event names and callback structures for server-to-client events. */
export type ServerToClientEventsMessagesType = {
  /** Triggered when a new message is received from the WhatsApp bot and redirected to the WhatsApp client. */
  message: (text: IWhatsappTextMessageFromServer) => void;
  /** Triggered when a new message is received from the WhatsApp bot where the user is newly created and it's first message. */
  contact: (contacts: IClientStoredContact) => void;
};

/** Defines the event names and callback structures for client-to-server events. */
export type ClientToServerEventsMessagesType = {
  /** Triggered when a WhatsApp chat message is sent from the client and should be redirected to the server. */
  message: (text: IWhatsappTextMessageFromClient, cb: (wamid: string) => void) => void;
};

/** Defines the event names and callback structures for inter-server events. */
export type InterServerEventsMessagesType = {};

/** Represents the additional data attached to the active socket connection. */
export type SocketDataMessagesType = {
  /** Specifies the user for whom the socket is currently interested in, in order to send only the messages for the chat they are currently on. */
  currentChatUser: IUser["wa_id"];
};
// ------------------------ FOR "/messages" ------------------------

/** Represents the type of socket when listening to the socket connection within the "messages" namespace. */
export type ChatSocket = Socket<
  ClientToServerEventsMessagesType,
  ServerToClientEventsMessagesType,
  InterServerEventsMessagesType,
  SocketDataMessagesType
> & RootSocket;

/** Represents the specific namespace, including its event types and socket data payload. */
export type ChatNamespace = Namespace<
  ClientToServerEventsMessagesType,
  ServerToClientEventsMessagesType,
  InterServerEventsMessagesType,
  SocketDataMessagesType
> & RootNamespace;
