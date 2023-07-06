import TelegramBot from "node-telegram-bot-api";
import Constants from "../../../../Constants";

/**
 * Check if the given message is a bot command
 * @param message The Telegram message object
 * @returns The index of the bot command in Constants.BOT_COMMANDS array, or -1 if not a bot command
 */
export function checkIfMessageIsBotCommand(
  message: TelegramBot.Message
): number {
  // If this is the received text: '/help' -> 'help' used to compare the stored supported bot commands.
  if (message?.entities && message.entities[0].type === "bot_command") {
    const commandIndex = Constants.BOT_COMMANDS.findIndex(
      (botCommand) => botCommand.command === message.text!.substring(1)
    );
    return commandIndex;
  }
  return -1;
}
