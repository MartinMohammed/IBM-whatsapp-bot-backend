import { IWebhookMessagesPayload } from "./types/webhookMessagesPayload";
import { validateWebhookPayload } from "./validateWebhookPayload";
import { handleMessages } from "./handleWebhook/handleMessages";
import { FieldTypes, IChange } from "./types/change";
import logger from "../../../logger";

/**
 * Processes the webhook payload and invokes the appropriate message handlers.
 * @param webhookPayload - The webhook payload object.
 * @returns Always returns undefined.
 */
export function processWebhookPayload(
  webhookPayload: IWebhookMessagesPayload
): undefined {
  const { object: _, entry } = webhookPayload;

  // Validate the payload: Check if it is for a WhatsApp Business Account and contains at least one entry
  const notValidWebhookPayloadInGeneral =
    !validateWebhookPayload(webhookPayload);
  if (notValidWebhookPayloadInGeneral) {
    logger.warn("Invalid webhook payload received.");
    return undefined;
  }

  // Iterate through each entry and invoke the appropriate handler based on the message type
  const { id: __, changes } = entry[0];
  processChanges(changes);
}

// TODO: MOVE IT TO WORKER, TO PROCESS THE CHANGES.
function processChanges(changes: IChange[]) {
  // Go through every change.
  changes.forEach((change) => {
    const { field, value } = change;
    // Currently only supported 'messages'
    switch (field) {
      case FieldTypes.Messages:
        // field — String. Notification type.

        // Extract the objects we're interested in from the 'value' object.
        const { metadata, contacts, messages } = value;
        if (contacts && messages && messages.length !== 0) {
          handleMessages(messages, metadata);
        } else {
          logger.warn("Received empty messages in the webhook payload.");
          throw Error("Messages should not be empty.");
        }
        break;
      default:
        logger.warn(`Unhandled webhook field: '${field}'`);
        throw new Error(`Unhandled webhook field: '${field}'`);
    }
  });
}
