import { IClientStoredMessage } from "./ClientStoredMessage";

/** This defines the structure of the User object stored in the client side  */
export interface IClientStoredUser {
  name: string;  // the name of the user; 
  wa_id: string; // the phone number of the  user
  whatsapp_messages: IClientStoredMessage[];
}
