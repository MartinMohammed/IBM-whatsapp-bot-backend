/** This represents a user stored in the database (users collection) */

import { demoWhatsappContact } from "../REST/whatsappDemoWebhookPayload";
import demoWhatsappMessageStored from "./whatsappMessageStored";

const demoUserStored = {
    name: demoWhatsappContact.profile.name,
    wa_id: demoWhatsappContact.wa_id, 
    whatsapp_messages: demoWhatsappMessageStored
}

export default demoUserStored