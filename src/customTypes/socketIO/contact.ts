import { Types } from "mongoose";
import { IUser } from "../models/User";

/**
 * Represents a contact in the contact list sent to the user when they initially connect to the socket.
 */
export interface IClientStoredContact {
    _id?: Types.ObjectId; // The document ID of the user (optional)
  wa_id: IUser["wa_id"]; // The WhatsApp ID of the contact
  name: IUser["name"]; // The name of the contact
  whatsappProfileImage: IUser["whatsappProfileImage"]; // The WhatsApp profile image of the contact
  // TODO: set the unread messages to false
  // hasUnreadMessages: boolean;  // Whether the user has unread messages with a given contact (in chat)
}
