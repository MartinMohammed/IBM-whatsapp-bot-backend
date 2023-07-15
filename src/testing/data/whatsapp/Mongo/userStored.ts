/** This represents a user stored in the database (users collection) */

import { IUser } from "../../../../app";
import { demoWhatsappContact } from "../REST/whatsappDemoWebhookPayload";
import demoWhatsappMessageStored from "./whatsappMessageStored";

const demoUserStored: IUser = {
    name: demoWhatsappContact.profile.name,
    wa_id: demoWhatsappContact.wa_id, 
    whatsapp_messages: [demoWhatsappMessageStored], 
    whatsappProfileImage: "https://bootdey.com/img/Content/avatar/avatar1.png"
    
}

export default demoUserStored