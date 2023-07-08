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
      // ------------------- NOT HANDLED YET -------------------
      /* istanbul ignore next */
      case FieldTypes.AccountAlerts:
      /* istanbul ignore next */
      case FieldTypes.AccountReviewUpdate:
      /* istanbul ignore next */
      case FieldTypes.AccountUpdate:
      /* istanbul ignore next */
      case FieldTypes.BusinessCapabilityUpdate:
      /* istanbul ignore next */
      case FieldTypes.BusinessStatusUpdate:
      /* istanbul ignore next */
      case FieldTypes.CampaignStatusUpdate:
      /* istanbul ignore next */
      case FieldTypes.MessageTemplateQualityUpdate:
      /* istanbul ignore next */
      case FieldTypes.MessageTemplateStatusUpdate:
      /* istanbul ignore next */
      case FieldTypes.Name:
      /* istanbul ignore next */
      case FieldTypes.PhoneNumberNameUpdate:
      /* istanbul ignore next */
      case FieldTypes.PhoneNumberQualityUpdate:
      /* istanbul ignore next */
      case FieldTypes.Security:
      /* istanbul ignore next */
      case FieldTypes.Subscribe:
      /* istanbul ignore next */
      case FieldTypes.TemplateCategoryUpdate:
      /* istanbul ignore next */
      case FieldTypes.Test:
        break;
      case FieldTypes.Messages:
        // ------------------- NOT HANDLED YET -------------------

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
        const _exhaustiveCheck: never = field;
        throw new Error(`Unhandled webhook field: '${field}'`);
    }
  });
}
