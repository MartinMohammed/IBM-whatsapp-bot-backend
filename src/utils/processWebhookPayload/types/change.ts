import { IStatus } from "./status";
import { IImageMessage, IReactionMessage, ITextMessage } from "./message";
import { IContact } from "./contact";

/**
 * Represents a change object in the webhook payload.
 */
export interface IChange {
  readonly value: IValue;
  // The field property in the webhook payload refers to the type of webhook event or notification being received.
  // It indicates the specific category or type of change that is being notified.
  readonly field: Field;
}

/**
 * Represents the value object within a change object.
 */
export interface IValue {
  // Product used to send the message.
  readonly messaging_product: "whatsapp";

  // A metadata object describing the business subscribed to the webhook.
  readonly metadata: {
    readonly display_phone_number: string;
    readonly phone_number_id: string;
  };
  // Array of contact objects with information for the customer who sent a message to the business.
  readonly contacts: IContact[];

  // Status object for a message that was sent by the business that is subscribed to the webhook.
  readonly statuses?: IStatus[];

  // Information about a message received by the business that is subscribed to the webhook.
  readonly messages?: ITextMessage[] | IImageMessage[] | IReactionMessage[];
}

/**
 * Enum representing the available field types.
 * Each enum value corresponds to a specific field type.
 */
export enum FieldTypes {
  Name = "Name",
  Test = "Test",
  Subscribe = "Subscribe",
  AccountAlerts = "account_alerts",
  AccountReviewUpdate = "account_review_update",
  AccountUpdate = "account_update",
  BusinessCapabilityUpdate = "business_capability_update",
  BusinessStatusUpdate = "business_status_update",
  CampaignStatusUpdate = "campaign_status_update",
  MessageTemplateQualityUpdate = "message_template_quality_update",
  MessageTemplateStatusUpdate = "message_template_status_update",
  Messages = "messages",
  PhoneNumberNameUpdate = "phone_number_name_update",
  PhoneNumberQualityUpdate = "phone_number_quality_update",
  Security = "security",
  TemplateCategoryUpdate = "template_category_update",
}

/**
 * Type representing a field in the webhook payload.
 * The `Field` type can only have values from the available field types defined in `FieldTypes` enum.
 */
export type Field =
  | FieldTypes.Name
  | FieldTypes.Test
  | FieldTypes.Subscribe
  | FieldTypes.AccountAlerts
  | FieldTypes.AccountReviewUpdate
  | FieldTypes.AccountUpdate
  | FieldTypes.BusinessCapabilityUpdate
  | FieldTypes.BusinessStatusUpdate
  | FieldTypes.CampaignStatusUpdate
  | FieldTypes.MessageTemplateQualityUpdate
  | FieldTypes.MessageTemplateStatusUpdate
  | FieldTypes.Messages
  | FieldTypes.PhoneNumberNameUpdate
  | FieldTypes.PhoneNumberQualityUpdate
  | FieldTypes.Security
  | FieldTypes.TemplateCategoryUpdate;
