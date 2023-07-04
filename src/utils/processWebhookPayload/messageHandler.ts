import { Value } from "./types/change";

import {
  IMessage,
  ITextMessage,
  IReactionMessage,
  IImageMessage,
  MessageTypes,
} from "./types/message";

// /**
//  * Represents a generic message handler.
//  * @param message - The message to handle.
//  * @param metadata - The metadata associated with the message.
//  */
// export function messageHandler(
//   message: ITextMessage,
//   metadata: Value["metadata"]
// ): void | { from: String; id: String; timestamp: String; type: String };

// export function messageHandler(
//   message: IReactionMessage,
//   metadata: Value["metadata"]
// ): void;

// export function messageHandler(
//   message: IImageMessage,
//   metadata: Value["metadata"]
// ): void | {
//   from: String;
//   id: String;
//   timestamp: String;
//   type: String;
// };

/**
 * Handles different types of messages by printing their properties.
 * @param message - The message to handle.
 * @param metadata - The metadata associated with the message.
 */
export function messageHandler(
  message: IMessage,
  metadata: Value["metadata"]
): void {
  console.log("From:", message.from);
  console.log("ID:", message.id);
  console.log("Timestamp:", message.timestamp);
  console.log("Type:", message.type);

  switch (message.type) {
    case MessageTypes.TEXT:
      // Handle text messages
      const textMessage = message as ITextMessage;
      console.log("Text:", textMessage.text.body);
      break;
    // TODO: IMPLEMENT
    case MessageTypes.REACTION:
      // // Handle reaction messages
      // const reactionMessage = message as IReactionMessage;
      // console.log("Reaction Message ID:", reactionMessage.reaction.message_id);
      // console.log("Emoji:", reactionMessage.reaction.emoji);
      break;
    case MessageTypes.IMAGE:
      // // Handle image messages
      // const imageMessage = message as IImageMessage;
      // console.log("Image Caption:", imageMessage.image.caption);
      // console.log("Image MIME Type:", imageMessage.image.mime_type);
      // console.log("Image SHA256:", imageMessage.image.sha256);
      // console.log("Image ID:", imageMessage.image.id);
      break;

    // Do nothing yet.
    case MessageTypes.AUDIO:
    case MessageTypes.CONTACTS:
    case MessageTypes.DOCUMENT:
    case MessageTypes.LOCATION:
    case MessageTypes.RECIPIENT_TYPE:
    case MessageTypes.STICKER:
    case MessageTypes.TEMPLATE:
      break;

    default:
      const _exhaustiveCheck: never = message.type;
      throw Error("Unknown Message Type: " + message.type);
  }
}
