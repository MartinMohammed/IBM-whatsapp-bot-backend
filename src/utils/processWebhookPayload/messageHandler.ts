import {
  IImageMessage,
  IReactionMessage,
  ITextMessage,
  IMessage,
  MessageType,
  Value,
  MessageTypes,
} from "./interfaces";

/**
 * Represents a generic message handler.
 * @param message - The message to handle.
 * @param metadata - The metadata associated with the message.
 */
export function messageHandler(
  message: ITextMessage,
  metadata: Value["metadata"]
): void;

export function messageHandler(
  message: IReactionMessage,
  metadata: Value["metadata"]
): void;

export function messageHandler(
  message: IImageMessage,
  metadata: Value["metadata"]
): void;

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

  if (message.type === MessageTypes.TEXT) {
    // Handle text messages
    const textMessage = message as ITextMessage;
    console.log("Text:", textMessage.text.body);
  } else if (message.type === MessageTypes.REACTION) {
    // Handle reaction messages
    const reactionMessage = message as IReactionMessage;
    console.log("Reaction Message ID:", reactionMessage.reaction.message_id);
    console.log("Emoji:", reactionMessage.reaction.emoji);
  } else if (message.type === MessageTypes.IMAGE) {
    // Handle image messages
    const imageMessage = message as IImageMessage;
    console.log("Image Caption:", imageMessage.image.caption);
    console.log("Image MIME Type:", imageMessage.image.mime_type);
    console.log("Image SHA256:", imageMessage.image.sha256);
    console.log("Image ID:", imageMessage.image.id);
  } else {
    // Handle unknown message types
    console.log("Unknown message type: ", message.type);
  }
}
