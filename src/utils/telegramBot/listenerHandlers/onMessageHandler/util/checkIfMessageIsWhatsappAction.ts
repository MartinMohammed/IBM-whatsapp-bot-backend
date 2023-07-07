import {
  SupportedTelegramActionType,
  SupportedTelegramActions,
} from "../types/supportedTelegramActions";

/**
 * Checks if a message is a WhatsApp action.
 * This function parses the received text message and checks its type.
 * @param message The message to check.
 * @returns The supported WhatsApp action type if the message is a WhatsApp action, otherwise undefined.
 */
export function checkIfMessageIsWhatsappAction(
  message: string
): SupportedTelegramActionType | undefined {
  // The first char must be a specific symbol.
  const isWhatsappAction = (
    Object.values(SupportedTelegramActions) as Array<string>
  ).includes(message[0]);

  return isWhatsappAction
    ? (message[0] as SupportedTelegramActionType)
    : undefined;
}
