/** Defines the structure of a single WhatsApp message stored in the database associated with a specific user. It includes properties from both the general WhatsApp message and the WhatsApp text message received from the server. */

import { IWhatsappMessage, IWhatsappTextMessageFromServer } from "../socketIO/messages";

// TODO: Consider adding a partial generic type to allow for other types of messages to be stored in the backend database. Currently, only WhatsApp messages are supported.
export type WhatsappMessageStoredType = IWhatsappMessage & IWhatsappTextMessageFromServer;