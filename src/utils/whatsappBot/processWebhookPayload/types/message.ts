import { IErrorMessage } from "./error";

/**
 * Represents a message object within the value object.
 */
export interface IMessage {
  /** The sender of the message. */
  from: string;
  /** The unique identifier of the message. */
  id: string;
  /** The timestamp when the message was sent. */
  timestamp: string;
  /** The type of the message. */
  type: MessageType;
  /** Additional context information about the replied message, if any. */
  context?: {
    /** The unique identifier of the replied message. */
    message_id: string;
    /** The sender of the replied message. */
    from: string;
  };
}

/**
 * Represents a text message object within the value object.
 */
export interface ITextMessage extends IMessage {
  /** The type of the message (must be 'text'). */
  type: MessageTypes.TEXT;
  /** The text content of the message. */
  text: { body: string };
}

/**
 * Represents a reaction message object within the value object.
 */
export interface IReactionMessage extends IMessage {
  /** The type of the message (must be 'reaction'). */
  type: MessageTypes.REACTION;
  /** The reaction details of the message. */
  reaction: {
    /** The unique identifier of the reacted message. */
    message_id: string;
    /** The emoji used for the reaction. */
    emoji: string;
  };
}

/**
 * Represents an image message object within the value object.
 */
export interface IImageMessage extends IMessage {
  /** The type of the message (must be 'image'). */
  type: MessageTypes.IMAGE;
  /** The details of the image. */
  image: {
    /** The caption of the image. */
    caption: string;
    /** The MIME type of the image. */
    mime_type: string;
    /** The SHA256 hash of the image. */
    sha256: string;
    /** The unique identifier of the image. */
    id: string;
  };
}

/**
 * Represents a sticker message object within the value object.
 */
export interface IStickerMessage extends IMessage {
  /** The type of the message (must be 'sticker'). */
  type: MessageTypes.STICKER;
  /** The details of the sticker. */
  sticker: {
    /** The MIME type of the sticker. */
    mime_type: string;
    /** The SHA256 hash of the sticker. */
    sha256: string;
    /** The unique identifier of the sticker. */
    id: string;
  };
}

/**
 * Represents an unknown message object within the value object.
 */
export interface IUnkownMessage extends IMessage {
  /** The type of the message (must be 'unknown'). */
  type: MessageTypes.UNKOWN;
  /** The error messages associated with the unknown message. */
  errors?: IErrorMessage[];
}

/**
 * Represents an unsupported message object within the value object.
 */
export interface IUnsupportedMessage extends IMessage {
  /** The type of the message (must be 'unsupported'). */
  type: MessageTypes.UNSUPPORTED;
  /** The error messages associated with the unsupported message. */
  errors?: IErrorMessage[];
}

/**
 * Represents a location message object within the value object.
 */
export interface ILocationMessage extends IMessage {
  /** The details of the location. */
  location: {
    /** The latitude of the location. */
    latitude: number;
    /** The longitude of the location. */
    longitude: number;
    /** The name of the location. */
    name: string;
    /** The address of the location. */
    address: string;
  };
}

/**
 * Represents a quick reply button message objectwithin the value object.
 */
export interface IQuickReplyButtonMessage extends IMessage {
  /** The type of the message (must be 'button'). */
  type: MessageTypes.BUTTON;
  /** The details of the button. */
  button: {
    /** The text displayed on the button. */
    text: String;
    /** The payload returned when the button is clicked. */
    payload: String;
  };
}

/**
 * Represents the different types of messages as named constants.
 * Contains some types that are only available when receiving messages.
 */
export enum MessageTypes {
  TEXT = "text",
  IMAGE = "image",
  REACTION = "reaction",
  STICKER = "sticker",
  UNKOWN = "unknown",
  BUTTON = "button",
  ORDER = "order",
  INTERACTIVE = "list_reply",
  SYSTEM = "system",
  UNSUPPORTED = "unsupported",
}

/**
 * Represents the different types of messages that are supported by Meta.
 * And currently supported by our application: "text" | "image" | "reaction"
 */
export type MessageType =
  | MessageTypes.TEXT
  | MessageTypes.REACTION
  | MessageTypes.IMAGE
  | MessageTypes.STICKER
  | MessageTypes.UNKOWN
  | MessageTypes.BUTTON
  | MessageTypes.ORDER
  | MessageTypes.INTERACTIVE
  | MessageTypes.SYSTEM
  | MessageTypes.UNSUPPORTED;
