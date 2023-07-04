/**
 * Represents a message object within the value object.
 */
export interface IMessage {
  readonly from: string;
  readonly id: string;
  readonly timestamp: string;
  readonly type: MessageType;
}

/**
 * Represents a text message object within the value object.
 */
export interface ITextMessage extends IMessage {
  readonly type: MessageTypes.TEXT;
  readonly text: { readonly body: string };
}

/**
 * Represents a reaction message object within the value object.
 */
export interface IReactionMessage extends IMessage {
  readonly type: MessageTypes.REACTION;
  readonly reaction: {
    readonly message_id: string;
    readonly emoji: string;
  };
}

/**
 * Represents an image message object within the value object.
 */
export interface IImageMessage extends IMessage {
  readonly type: MessageTypes.IMAGE;
  readonly image: {
    readonly caption: string;
    readonly mime_type: string;
    readonly sha256: string;
    readonly id: string;
  };
}

/**
 * Represents the different types of messages as named constants.
 */
export enum MessageTypes {
  TEXT = "text",
  IMAGE = "image",
  REACTION = "reaction",
  AUDIO = "audio",
  CONTACTS = "contacts",
  DOCUMENT = "document",
  LOCATION = "location",
  RECIPIENT_TYPE = "recipient_type",
  STICKER = "sticker",
  TEMPLATE = "template",
}

/**
 * Represents the different types of messages that are supported by Meta.
 * And currently supported by our application: "text" | "image" | "reaction" | "audio" | "contacts" | "document" | "location" | "recipient_type" | "sticker" | "template"
 */
export type MessageType =
  | MessageTypes.TEXT
  | MessageTypes.IMAGE
  | MessageTypes.REACTION
  | MessageTypes.AUDIO
  | MessageTypes.CONTACTS
  | MessageTypes.DOCUMENT
  | MessageTypes.LOCATION
  | MessageTypes.RECIPIENT_TYPE
  | MessageTypes.STICKER
  | MessageTypes.TEMPLATE;
