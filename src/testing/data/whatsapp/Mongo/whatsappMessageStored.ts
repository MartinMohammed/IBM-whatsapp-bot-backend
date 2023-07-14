
import { WhatsappMessageStoredType } from "../../../../customTypes/models/WhatsappMessagesStored";
import demoWhatsappMessageFromClient from "../SocketIO/whatsappDemoMessageFromClient";
import { demoWamId } from "../REST/whatsappDemoWebhookPayload";

 const demoWhatsappMessageStored: WhatsappMessageStoredType = {
    ...demoWhatsappMessageFromClient, 
    wam_id: demoWamId, 
  }
  export default demoWhatsappMessageStored