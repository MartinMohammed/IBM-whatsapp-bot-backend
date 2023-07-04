import { IErrorMessage } from "./error";

/**
 * Represents a message object within the value object.
 */
export interface IMessage {
  readonly from: string;
  readonly id: string;
  readonly timestamp: string;
  readonly type: MessageType;
  // From represents the point of time the message was sent.
  // context, information about the message that was replied to.
  readonly context?: {
    message_id: string;
    from: string;
  };
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
 * Yes, when you react to a WhatsApp message with an emoji, it can be referred to as a "reaction object."
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

export interface IStickerMessage extends IMessage {
  readonly type: MessageTypes.STICKER;
  readonly sticker: {
    mime_type: string;
    sha256: string;
    id: string;
  };
}

export interface IUnkownMessage extends IMessage {
  readonly type: MessageTypes.UNKOWN;
  readonly?: IErrorMessage[];
}

// e.g.  Currently, the Cloud API does not support webhook status updates for deleted messages.
// If a user deletes a message, you will receive a webhook with an error code for an unsupported message type:
export interface IUnsupportedMessage extends IMessage {
  readonly type: MessageTypes.UNSUPPORTED;
  readonly errors?: IErrorMessage[];
}

export interface ILocationMessage extends IMessage {
  // Somehow does not have a type
  readonly location: {
    readonly latitude: number;
    readonly longitude: number;
    readonly name: string;
    readonly address: string;
  };
}

export interface IQuickReplyButtonMessage extends IMessage {
  readonly type: MessageTypes.BUTTON;
  button: {
    // Required for URL buttons.
    text: String;
    // Developer-defined payload that is returned when the button is clicked in addition to the display text on the button.
    payload: String;
  };
}

/**
 * Represents the different types of messages as named constants.
 * Contains some Types that are only available when receiving messanges.
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
