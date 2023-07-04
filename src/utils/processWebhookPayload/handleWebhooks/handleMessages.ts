import { messageHandler } from "../messageHandler";
import { IValue } from "../types/change";
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
export async function handleMessages(
  messages: IMessage[],
  metadata: IValue["metadata"]
) {
  messages.forEach((message) => {
    messageHandler(message, metadata);
  });
}
