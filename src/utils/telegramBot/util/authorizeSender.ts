import TelegramBot from "node-telegram-bot-api";
import logger from "../../../logger";
import Constants from "../../Constants";

/**
 * Verifies that the 'from' / User that sends the event / message is allowed to interact with the system.
 * @param user The user sending the message.
 * @param message Optional additional message to log.
 * @param whiteList The list of authorized user IDs.
 * @returns True if the user is authorized, false otherwise.
 */
export function authorizeSender(
  user: TelegramBot.User | undefined,
  message: string = "",
  whiteList: Array<TelegramBot.User["id"]> = Constants.MESSAGE_WHITE_LIST
): boolean {
  if (!user) {
    logger.warn(
      `No user was provided. Not allowed to access the system. ${message}`
    );
    return false; // Stop further processing
  }
  return userIsWhitelisted(user, message, whiteList);
}

function userIsWhitelisted(
  user: TelegramBot.User,
  message: string,
  whiteList: Array<TelegramBot.User["id"]>
): boolean {
  // Check if the user is whitelisted.
  if (!whiteList.includes(user.id)) {
    const logMessage = `User ${
      user.id
    } is not authorized to interact with the chatbot.${
      message ? ` ${message}` : ""
    }`;
    logger.warn(logMessage);
    return false; // Stop further processing
  }
  logger.info(`Authorized user: ${user.id}`);
  return true;
}
