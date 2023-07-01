import {
  IImageMessage,
  IReactionMessage,
  ITextMessage,
  IWebhookPayload,
  MessageTypes,
} from "./interfaces";
import { messageHandler } from "./messageHandler";

/**
 * Processes the webhook payload and invokes the appropriate message handlers.
 * @param webhookPayload - The webhook payload object.
 * @returns Always returns undefined.
 */
export function processWebhookPayload(
  webhookPayload: IWebhookPayload
): undefined {
  const { object, entry } = webhookPayload;

  // Validate the payload: Check if it is for a WhatsApp Business Account and contains at least one entry
  if (
    object !== "whatsapp_business_account" ||
    !entry ||
    entry.length === 0 ||
    !entry[0].changes ||
    entry[0].changes.length === 0
  ) {
    return undefined;
  }

  // Iterate through each entry and invoke the appropriate handler based on the message type
  const { id, changes } = entry[0];
  const { value, field } = changes[0];

  // field — String. Notification type.
  if (field !== "messages") {
    return undefined;
  }

  // Extract the objects we're interested in from the 'value' object.
  const { messaging_product, metadata, contacts, messages } = value;

  if (
    messaging_product === "whatsapp" &&
    metadata &&
    contacts &&
    messages &&
    messages.length !== 0
  ) {
    messages.forEach((message) => {
      switch (message.type) {
        case MessageTypes.TEXT:
          // Invoke the text message handler
          messageHandler(message as ITextMessage, metadata);
          break;
        case MessageTypes.IMAGE:
          // Invoke the image message handler
          messageHandler(message as IImageMessage, metadata);
          break;
        case MessageTypes.REACTION:
          // Invoke the reaction message handler
          messageHandler(message as IReactionMessage, metadata);
          break;
        default:
          // The message type is not supported
          console.log("Unsupported message type: ", message.type);
      }
    });
  }

  return undefined;
}
