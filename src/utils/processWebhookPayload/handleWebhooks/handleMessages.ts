import { messageHandler } from "../messageHandler";
import { Value } from "../types/change";
import {
  MessageTypes,
  IMessage,
  ITextMessage,
  IImageMessage,
  IReactionMessage,
} from "../types/message";

/**
 * Handles the message objects within the webhook payload.
 * @param messages - An array of message objects.
 * @param metadata - Metadata describing the business subscribed to the webhook.
 */
export function handleMessages(
  messages: IMessage[],
  metadata: Value["metadata"]
): void {
  messages.forEach((message) => {
    messageHandler(message, metadata);
  });
}
