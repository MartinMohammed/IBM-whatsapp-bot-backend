/**
 * Interface representing a WhatsApp message
 * that will be stored as element in the messages array of a given user.
 */
interface IWhatsappMessage {
  text: string; // Represents the text message content
  wa_id: string; // Represents the sender of the message (phone number)
  wam_id: string; // Represents the unique WhatsApp message ID
  timestamp?: number; // Represents the timestamp of the message  (auto generated if not provided)
}

export default IWhatsappMessage;
