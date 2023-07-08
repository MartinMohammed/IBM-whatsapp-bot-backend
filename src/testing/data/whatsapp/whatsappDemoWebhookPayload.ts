/**
 * Declare a namespace to extend the existing import
 */
import {
  IWebhookMessagesPayload,
  AllMessageTypes,
  AllFieldTypes,
  AllMessagingProductTypes,
} from "node-whatsapp-bot-api";

/**
 * Represents a demo Webhook payload sent by Meta to '/webhook' for change in 'messages' field
 */
export let whatsappDemoWebhookPayload: IWebhookMessagesPayload = {
  /**
   * Indicates the object type of the webhook payload
   */
  object: "whatsapp_business_account",
  /**
   * An array of webhook entry objects
   */
  entry: [
    {
      /**
       * The ID of the webhook entry
       */
      id: "987654321",
      /**
       * An array of change objects
       */
      changes: [
        {
          /**
           * The value of the change
           */
          value: {
            /**
             * The messaging product associated with the change
             */
            messaging_product: AllMessagingProductTypes.WHATSAPP,
            /**
             * Metadata related to the change
             */
            metadata: {
              /**
               * The display phone number associated with the change
               */
              display_phone_number: "123456789",
              /**
               * The phone number ID associated with the change
               */
              phone_number_id: "9876543210",
            },
            /**
             * An array of contact objects
             */
            contacts: [
              {
                /**
                 * Profile information of the contact
                 */
                profile: {
                  /**
                   * The name of the contact
                   */
                  name: "John Doe",
                },
                /**
                 * The WhatsApp ID of the contact
                 */
                wa_id: "987654321",
              },
            ],
            /**
             * An array of message objects
             */
            messages: [
              {
                /**
                 * The sender of the message
                 */
                from: "987654321",
                /**
                 * The ID of the message
                 */
                id: "wamid.HBgMNDkxNzk0NjYxMzUwFQIAEhgUM0E1QzYyMjQ5OTcwOUI3RDg0Q0YB",
                /**
                 * The timestamp of the message (Unix timestamp)
                 */
                timestamp: "1688401609",
                /**
                 * The text content of the message
                 */
                text: {
                  /**
                   * The body of the text message
                   */
                  body: "Hello",
                },
                /**
                 * The type of the message
                 */
                type: AllMessageTypes.TEXT,
              },
            ],
          },
          /**
           * The field property in the webhook payload refers to the type of webhook event or notification being received.
           */
          field: AllFieldTypes.MESSAGES,
        },
      ],
    },
  ],
};
