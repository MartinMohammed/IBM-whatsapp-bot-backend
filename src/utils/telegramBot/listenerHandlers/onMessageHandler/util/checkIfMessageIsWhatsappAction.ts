import { SupportedTelegramActions } from "../types/supportedTelegramActions";

/**
 *
 * Some messages sent to the Telegram App have the purpose to be send to a whatsapp user.
 * This function has the task to parse the received text message and look for it's type
 *  */

export function checkIfMessageIsWhatsappAction(message: string): boolean {
  // The first char must be a specific symbol.
  return (Object.values(SupportedTelegramActions) as Array<string>).includes(
    message[0]
  );
}
