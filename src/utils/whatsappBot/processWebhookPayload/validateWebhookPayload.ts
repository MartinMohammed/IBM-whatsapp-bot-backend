import { IWebhookMessagesPayload } from "./types/webhookMessagesPayload";
import logger from "../../../logger";
import { IChange } from "./types/change";
import { FieldTypes } from "./types/change";

/**
 * Validates the webhook payload received from WhatsApp.
 * Checks if the payload has the expected properties and values.
 * @param payload The webhook payload to validate.
 * @returns A boolean indicating whether the payload is valid.
 */
export function validateWebhookPayload(
  payload: IWebhookMessagesPayload
): boolean {
  // Check if the expected properties are present in the payload
  if (payload.object !== "whatsapp_business_account" || !payload.entry) {
    logger.warn("Invalid webhook payload structure.");
    return false;
  }

  // Check if the entry array and its first entry object are present
  const [entry] = payload.entry;
  if (!entry) {
    logger.warn("Empty entry in the webhook payload.");
    return false;
  }

  // Check if the changes array is present in the entry object
  const { changes } = entry;
  if (!changes) {
    logger.warn("No changes found in the webhook payload.");
    return false;
  }

  // Iterate over the changes and check if each change has a value property
  for (const change of changes) {
    if (checkIfChangeIsValid(change)) {
      logger.warn("Invalid change in the webhook payload.");
      return false;
    }
  }

  // If all checks pass, return true to indicate a valid payload
  return true;
}

/**
 * Checks whether the given change has the required properties.
 * Returns false if change is not valid, else returns true.
 */
function checkIfChangeIsValid(change: IChange): boolean {
  return Boolean(
    !change.value ||
      !change.value.metadata ||
      change.value.messaging_product !== "whatsapp" ||
      change.field !== FieldTypes.Messages
  );
}
