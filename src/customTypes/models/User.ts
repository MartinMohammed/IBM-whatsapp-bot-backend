import { IWhatsappMessage, IWhatsappTextMessageFromServer } from "../socketIO/messages";
import { Document } from "mongoose";

export interface IUser {
  name: string; // Represents the name of the user (WhatsApp user)
  wa_id: string; // Represents the phone number of the user
  whatsapp_messages: (IWhatsappMessage & IWhatsappTextMessageFromServer)[]; // Represents the whatsapp conversation between us and the user.
}

/**
 * Interface representing a User document.
 */
type UserModelType = IUser & Document

export default UserModelType;
