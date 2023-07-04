import { MessageType } from "../../processWebhookPayload/types/message";

/**
 * Types of message objects:
 * Text: Represents a message containing text content.
 * Media: Represents a message containing media content such as images or videos.
 * Reaction: Represents a reaction to another message.
 * Location: Represents a message that contains location information.
 * Template: Represents a message that follows a predefined template structure.
 * Contacts: Represents a message that contains contact information.
 * Interactive: Represents a message that allows user interaction with options or buttons.
 */

// The general blueprint for any message sent to a user.
export interface IMessageObject {
  readonly messaging_product: "whatsapp";
  readonly recipient_type: "individual";
  // WhatsApp ID / phone number
  readonly to: string;
  // HSM (Highly Structured Message)
  // Send pre-approved template messages to customers.
  // HSMs typically contain specific parameters that can be dynamically filled with personalized content,
  // such as order details, transaction information, or appointment reminders.
  readonly type: MessageType;
}

// The blueprint for a text message sent to a user.
export interface ITextObject extends IMessageObject {
  readonly text: {
    // Set to true to attempt rendering a link preview of any URL in the body text string
    // If multiple URLs are present, only the first URL will be rendered.
    // If preview_url is omitted or unable to retrieve a preview, a clickable link will be rendered instead.
    readonly preview_url: boolean;
    readonly body: string;
  };
}

export interface IMessageResponseData {
  // Mocked response data
  messaging_product: "whatsapp";
  contacts: {
    // waid / phone number
    input: string;
    wa_id: string;
  }[];

  messages: {
    id: string; // Sent message whatsapp id
  }[];
}
