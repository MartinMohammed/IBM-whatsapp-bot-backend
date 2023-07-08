import { MessageType } from "../../processWebhookPayload/types/message";

/**
 * Represents the types of message objects:
 * - Text: Represents a message containing text content.
 * - Media: Represents a message containing media content such as images or videos.
 * - Reaction: Represents a reaction to another message.
 * - Location: Represents a message that contains location information.
 * - Template: Represents a message that follows a predefined template structure.
 * - Contacts: Represents a message that contains contact information.
 * - Interactive: Represents a message that allows user interaction with options or buttons.
 */

/**
 * The general blueprint for any message sent to a user.
 */
export interface IMessageObject {
  /**
   * The messaging product associated with the message.
   */
  readonly messaging_product: "whatsapp";
  /**
   * The recipient type of the message.
   */
  readonly recipient_type: "individual";
  /**
   * The WhatsApp ID or phone number of the recipient.
   */
  readonly to: string;
  /**
   * The type of the message.
   */
  readonly type: MessageType;
}

/**
 * The blueprint for a text message sent to a user.
 */
export interface ITextObject extends IMessageObject {
  /**
   * The text content of the message.
   */
  readonly text: {
    /**
     * Set to true to attempt rendering a link preview of any URL in the body text string.
     * If multiple URLs are present, only the first URL will be rendered.
     * If preview_url is omitted or unable to retrieve a preview, a clickable link will be rendered instead.
     */
    readonly preview_url: boolean;
    /**
     * The body text of the message.
     */
    readonly body: string;
  };
}

export interface IMessageResponseData {
  /**
   * The messaging product associated with the response data.
   */
  messaging_product: "whatsapp";
  /**
   * An array of contact information.
   */
  contacts: {
    /**
     * The input (WhatsApp ID or phone number) used in the request.
     */
    input: string;
    /**
     * The WhatsApp ID associated with the contact.
     */
    wa_id: string;
  }[];
  /**
   * An array of message IDs representing the sent messages.
   */
  messages: {
    /**
     * The WhatsApp ID of the sent message.
     */
    id: string;
  }[];
}
