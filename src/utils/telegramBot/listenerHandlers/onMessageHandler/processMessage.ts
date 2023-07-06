import TelegramBot from "node-telegram-bot-api";
import logger from "../../../../logger";
import { commandHandler } from "./commandHandler";
import { checkIfMessageIsBotCommand } from "./checkIfMessageIsBotCommand";

/**
 * Processes the received message by logging it for debugging purposes.
 * @param message The received message.
 */
export function processMessage(message: TelegramBot.Message) {
  logger.debug(`Received a message ${JSON.stringify(message)}`);
  const index = checkIfMessageIsBotCommand(message);
  if (index === -1) {
    // Bot command is not supported
    logger.verbose(`${message.text} is not a bot command.`);
    return; // stop processing
  }
  logger.verbose(`${message.text} is a bot command.`);
}
