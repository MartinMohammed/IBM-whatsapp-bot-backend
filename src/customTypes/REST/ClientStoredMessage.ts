import { IWhatsappTextMessageFromClient } from "../socketIO/messages";

/** Represents how the client stores the message - property of ClientStoredUser */
export interface IClientStoredMessage extends IWhatsappTextMessageFromClient {
    // If undefined, then awaiting for server (whatsapp bot) to provide
    wam_id: string | undefined;  // Unqiue identifier for the whatsapp message. 
}
