import TelegramBot from "node-telegram-bot-api";
import logger from "../../../../logger";
import { commandHandler } from "./textMessageHandler/commandHandler";
import { checkIfMessageIsBotCommand } from "./util/checkIfMessageIsBotCommand";
import { checkIfMessageIsWhatsappAction } from "./util/checkIfMessageIsWhatsappAction";

/** Represents the message types that are currently supported by this application. */
enum CurrentlySupportedMessages {
  TEXT = "text",
}

/**
 * Processes the received message by logging it for debugging purposes.
 * @param message The received message.
 */
export function processMessage(message: TelegramBot.Message) {
  logger.debug(`Received a message ${JSON.stringify(message)}`);

  // Handle text message
  // ! Bot commands are sent over as plain text, '/command'.
  if (message[CurrentlySupportedMessages.TEXT]) {
    const index = checkIfMessageIsBotCommand(message);
    if (index !== -1) {
      logger.verbose(`${message.text} is a bot command.`);
      commandHandler(message, index);
    } else if (checkIfMessageIsWhatsappAction(message.text)) {
      logger.verbose(`${message.text} is a telegram action.`);
    } else {
      logger.warn(
        `Unhandled text message, no matching signature for: ${message.text}.`
      );
    }
  } else {
    logger.warn(
      `Unhandled message ${JSON.stringify(message)}. It's type was not handled.`
    );
    return;
  }
}
