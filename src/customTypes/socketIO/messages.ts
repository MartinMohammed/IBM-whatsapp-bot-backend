/**
 * Interface representing a WhatsApp message sent by the user from the client side.
 */
export interface IWhatsappMessage {
  wa_id: string; // The phone number of the user.
  timestamp: number; // The timestamp in Unix format.
  sentByClient: boolean; // determines whether the message by the customer to us.
  // TODO
  // messageIndex: number;  // represents the specific index of the message in the entire conversation
}

/**
 * Interface representing a text message sent by the user from the client side.
 * Extends the IWhatsappMessage interface.
 */
export interface IWhatsappTextMessageFromClient extends IWhatsappMessage {
  text: string; // The text message sent.
}

/**
 * Interface representing a text message received from the server and stored as an element in the messages array.
 * Extends the IWhatsappMessage interface.
 */
export interface IWhatsappTextMessageFromServer extends IWhatsappMessage {
  text: string; // Represents the text message content.
  wam_id: string; // Represents the unique WhatsApp message ID.
}
