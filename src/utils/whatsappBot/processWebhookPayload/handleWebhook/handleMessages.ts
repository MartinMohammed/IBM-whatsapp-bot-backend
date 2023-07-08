import { messageHandler } from "../messageHandler";
import { IValue } from "../types/change";
import { IMessage } from "../types/message";
import logger from "../../../../logger";

/**
 * Handles the message objects within the webhook payload.
 * @param messages - An array of message objects.
 * @param metadata - Metadata describing the business subscribed to the webhook.
 */
export async function handleMessages(
  messages: IMessage[],
  metadata: IValue["metadata"]
) {
  logger.info("Handling messages:", { messages, metadata });

  messages.forEach((message) => {
    messageHandler(message, metadata);
  });
}
