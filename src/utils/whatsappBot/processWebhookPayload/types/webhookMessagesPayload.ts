import { IChange } from "./change";

// TODO: Need assign those somewhere:
// presence: Represents changes in the online presence status of contacts.
// contacts: Represents changes in the contact list, such as adding or removing contacts.

// Interfaces

/**
 * Represents the payload received from WhatsApp's webhook.
 */
export interface IWebhookMessagesPayload {
  readonly object: "whatsapp_business_account"; // Identifies the entity type (WhatsApp business account)
  readonly entry: IEntry[];
}

/**
 * Represents an entry object in the webhook payload.
 */
export interface IEntry {
  // The WhatsApp Business Account ID for the business that is subscribed to the webhook.
  readonly id: string;
  readonly changes: IChange[];
}
