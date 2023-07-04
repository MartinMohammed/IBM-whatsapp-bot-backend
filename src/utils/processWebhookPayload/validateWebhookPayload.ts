import { IWebhookMessagesPayload } from "./types/webhookMessagesPayload";

/**
 * Validates the webhook payload received from WhatsApp.
 * Checks if the payload has the expected properties and values.
 * object & entry \ check for changes in first entry  and if value is defined.
 * @param payload The webhook payload to validate.
 * @returns A boolean indicating whether the payload is valid.
 */
export function validateWebhookPayload(
  payload: IWebhookMessagesPayload
): boolean {
  // Check if the expected properties are present in the payload
  if (payload.object !== "whatsapp_business_account" || !payload.entry) {
    return false;
  }

  // Check if the entry array and its first entry object are present
  const [entry] = payload.entry;
  if (!entry) {
    return false;
  }

  // Check if the changes array is present in the entry object
  const { changes } = entry;
  if (!changes) {
    return false;
  }

  // Iterate over the changes and check if each change has a value property
  for (const change of changes) {
    if (
      !change.value ||
      !change.value.metadata ||
      change.value.messaging_product !== "whatsapp" ||
      change.field !== "messages"
    ) {
      return false;
    }
  }

  // If all checks pass, return true to indicate a valid payload
  return true;
}
