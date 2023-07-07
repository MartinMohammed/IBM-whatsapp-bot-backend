import TelegramBot from "node-telegram-bot-api";
import logger from "../../../../logger";
import commandHandler from "./textMessageHandler/commandHandler";
import { checkIfMessageIsBotCommand } from "./util/checkIfMessageIsBotCommand";
import { checkIfMessageIsWhatsappAction } from "./util/checkIfMessageIsWhatsappAction";
import actionHandler from "./textMessageHandler/actionHandler";
import { SupportedTelegramMessages } from "./types/supportedTelegramMessages";

/**
 * Processes the received message by logging it for debugging purposes.
 * @param message The received message.
 */
export function processMessage(message: TelegramBot.Message) {
  logger.debug(`Received a message ${JSON.stringify(message)}`);

  // Handle text message
  // ! Bot commands are sent over as plain text, '/command'.
  if (message[SupportedTelegramMessages.TEXT]) {
    const index = checkIfMessageIsBotCommand(message);
    if (index !== -1) {
      logger.verbose(`${message.text} is a bot command.`);
      commandHandler(message, index);
      return;
    }

    const action = checkIfMessageIsWhatsappAction(message.text);
    if (action) {
      logger.verbose(`${message.text} is a telegram action.`);
      actionHandler(message, action);
    }

    // No match
    logger.warn(
      `Unhandled text message, no matching signature for: ${message.text}.`
    );
    return;
  } else {
    logger.warn(
      `Unhandled message ${JSON.stringify(message)}. It's type was not handled.`
    );
    return;
  }
}
