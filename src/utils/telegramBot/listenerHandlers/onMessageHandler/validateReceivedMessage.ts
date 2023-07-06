import logger from "../../../../logger";
import TelegramBot from "node-telegram-bot-api";

/**
 * Validates the received message and checks if it meets the required criteria.
 * @param message The received message.
 * @returns True if the message is valid and can be further processed, false otherwise.
 */
export function validateReceivedMessage(message: TelegramBot.Message): boolean {
  if (!message) {
    logger.warn("Received an undefined message.");
    return false; // Stop further processing
  }
  return true;
}
