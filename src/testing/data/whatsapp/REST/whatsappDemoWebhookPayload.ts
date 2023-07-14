import { ITextMessage, IListenerTextMessage, IContact } from "node-whatsapp-bot-api";


/**
 * Declare a namespace to extend the existing import
 */
import {
  IWebhookMessagesPayload,
  AllMessageTypes,
  AllFieldTypes,
  AllMessagingProductTypes,
} from "node-whatsapp-bot-api";

export const demoWamId = "wamid.HBgMNDkxNzk0NjYxMzUwFQIAEhgUM0E1QzYyMjQ5OTcwOUI3RDg0Q0YB"

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
                wa_id: "9876543211",
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
                id: demoWamId, 
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

/** The different fields that a whatsapp message has. */
export const { messaging_product, metadata, contacts, messages } =
  whatsappDemoWebhookPayload["entry"][0].changes[0].value;
const message = messages![0] as ITextMessage;


export const demoWhatsappContact: IContact = {
  profile:{
    name: "John Doe",
  }, 
  wa_id: whatsappDemoWebhookPayload.entry[0].changes[0].value.contacts[0].wa_id,
};

/** What we receive from the chat bot when listening on incoming text messages */
export const demoListenerTextMessage: IListenerTextMessage = {
  type: AllMessageTypes.TEXT,
  contact: {
    wa_id: demoWhatsappContact.wa_id,
    profile: {
      name: demoWhatsappContact.profile.name,
    },
  },
  metadata,
  text: message.text,
  message_id: message.id,
  timestamp: +message.timestamp,
  messaging_product,
};

