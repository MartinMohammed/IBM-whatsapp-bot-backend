import IWhatsappMessage from "./WhatsappMessage";
import { Document } from "node-telegram-bot-api";

/**
 * Interface representing a User document.
 */
interface IUser extends Document {
  name: string; // Represents the name of the user (WhatsApp user)
  wa_id: string; // Represents the phone number of the user
  whatsapp_messages: IWhatsappMessage[]; // Represents the WhatsApp messages associated with the user
}

export default IUser;
