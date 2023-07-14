/** Represents a demo whatsapp message from the client */

import { IWhatsappTextMessageFromClient } from "../../../../customTypes/socketIO/messages";
import { demoWhatsappContact } from "../REST/whatsappDemoWebhookPayload";
import { demoListenerTextMessage } from "../REST/whatsappDemoWebhookPayload";

export const demoWhatsappMessageFromClient: IWhatsappTextMessageFromClient = {
  wa_id: demoWhatsappContact.wa_id,
  text: demoListenerTextMessage.text.body,
  timestamp: demoListenerTextMessage.timestamp,
  sentByClient: false,  // send by us 
};


export default demoWhatsappMessageFromClient;
