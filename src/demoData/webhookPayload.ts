import { IWebhookMessagesPayload } from "../utils/processWebhookPayload/types/webhookMessagesPayload";
import { MessageTypes } from "../utils/processWebhookPayload/types/message";
import { FieldTypes } from "../utils/processWebhookPayload/types/change";
export let demoChangesPayload: IWebhookMessagesPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "987654321",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "123456789",
              phone_number_id: "9876543210",
            },
            contacts: [
              {
                profile: {
                  name: "John Doe",
                },
                wa_id: "987654321",
              },
            ],
            messages: [
              {
                from: "987654321",
                id: "wamid.HBgMNDkxNzk0NjYxMzUwFQIAEhgUM0E1QzYyMjQ5OTcwOUI3RDg0Q0YB",
                timestamp: "1688401609",
                text: {
                  body: "Hello",
                },
                type: MessageTypes.TEXT,
              },
            ],
          },
          field: FieldTypes.Messages,
        },
      ],
    },
  ],
};
