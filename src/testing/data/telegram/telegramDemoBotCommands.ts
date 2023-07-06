import TelegramBot from "node-telegram-bot-api";

/**
 * Array of Telegram bot commands for the demo bot.
 */
const telegramDemoBotCommands: TelegramBot.BotCommand[] = [
  { command: "help", description: "Was kann der Bot?" },
];

export default telegramDemoBotCommands;
