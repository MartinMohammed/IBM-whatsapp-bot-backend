import TelegramBot from "node-telegram-bot-api";
import Constants from "../../Constants";

export async function fetchBotCommands(
  telegramBot: TelegramBot
): Promise<void> {
  // Fetch the latest and save it into constants commands
  Constants.BOT_COMMANDS = await telegramBot.getMyCommands();
}
