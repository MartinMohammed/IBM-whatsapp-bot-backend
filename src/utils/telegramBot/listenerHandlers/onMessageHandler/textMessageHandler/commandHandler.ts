import TelegramBot from "node-telegram-bot-api";
import Constants from "../../../../Constants";
import logger from "../../../../../logger";
import {
  SupportedBotCommands,
  SupportedBotCommandType,
} from "./types/supportedBotCommands";
import { sendTextMessage } from "../../../messagingFeatures/telegramSendTextMessage";

// TODO: integrate to a Content Management system

/**
 * Handles a validated bot command and performs an action based on it.
 * Retrieves the command from the Constants array of bot commands.
 */
function commandHandler(message: TelegramBot.Message, index: number) {
  const botCommandObject = Constants.BOT_COMMANDS[index];

  let botCommand: SupportedBotCommandType | undefined;
  if (botCommandObject) {
    // Found a bot command.
    // ! Get rid of the '/' in '/command'
    botCommand = botCommandObject.command as SupportedBotCommandType;
  }

  if (
    botCommand &&
    Constants.BOT_COMMAND_MESSAGE_TEMPLATES[botCommand] === undefined
  ) {
    logger.error(
      `Unable to retrieve a commandMessageTemplate for botCommand: ${botCommand}.`
    );
    return;
  }

  switch (botCommand) {
    case SupportedBotCommands.HELP:
      logger.verbose("Received bot command: /help");
      // Perform action for the "help" command
      sendTextMessage(
        message.chat.id,
        Constants.BOT_COMMAND_MESSAGE_TEMPLATES[SupportedBotCommands.HELP]
      );
      break;

    // Since this function will only be executed beforehand when the message.from is a command,
    // this default block will only be executed if the previous function returned a wrong or invalid index.
    default:
      // The exhaustiveCheck variable is used to ensure that all possible cases of SupportedBotCommands are handled.
      const exhaustiveCheck: never = botCommand as never;
      logger.error(
        `Unhandled bot command at index ${index} in the bot command list.`
      );
  }
}

export default commandHandler;
