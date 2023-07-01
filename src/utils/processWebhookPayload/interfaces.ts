// Interfaces

/**
 * Represents the payload received from WhatsApp's webhook.
 */
export interface IWebhookPayload {
  readonly object: string;
  readonly entry: IEntry[];
}

/**
 * Represents an entry object in the webhook payload.
 */
export interface IEntry {
  readonly id: string;
  readonly changes: IChange[];
}

/**
 * Represents a change object in the webhook payload.
 */
export interface IChange {
  readonly value: Value;
  readonly field: string;
}

/**
 * Represents the value object within a change object.
 */
export interface Value {
  readonly messaging_product: string;
  readonly metadata: {
    readonly display_phone_number: string;
    readonly phone_number_id: string;
  };
  readonly contacts: IContact[];
  readonly messages: IMessage[];
}

/**
 * Represents a contact object within the value object.
 */
export interface IContact {
  readonly profile: {
    readonly name: string;
  };
  readonly wa_id: string;
}

/**
 * Represents a message object within the value object.
 */
export interface IMessage {
  readonly from: string;
  readonly id: string;
  readonly timestamp: number;
  readonly type: MessageType;
}

/**
 * Represents a text message object within the value object.
 */
export interface ITextMessage extends IMessage {
  readonly type: "text";
  readonly text: {
    readonly body: string;
  };
}

/**
 * Represents a reaction message object within the value object.
 */
export interface IReactionMessage extends IMessage {
  readonly type: "reaction";
  readonly reaction: {
    readonly message_id: string;
    readonly emoji: string;
  };
}

/**
 * Represents an image message object within the value object.
 */
export interface IImageMessage extends IMessage {
  readonly type: "image";
  readonly image: {
    readonly caption: string;
    readonly mime_type: string;
    readonly sha256: string;
    readonly id: string;
  };
}

/**
 * Represents the different types of messages that are supported.
 */
export type MessageType = "text" | "image" | "reaction";

/**
 * enum MessageTypes provides named constants that can be used in switch statements, configuration settings,
 * or any other place where you need to reference the message types with meaningful names.
 */
export enum MessageTypes {
  TEXT = "text",
  IMAGE = "image",
  REACTION = "reaction",
}
