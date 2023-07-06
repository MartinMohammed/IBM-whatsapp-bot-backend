import TelegramBot from "node-telegram-bot-api";

/**
 * Array of Telegram bot commands for the demo bot.
 * ! Interally the commands are stored without '/'
 */
const telegramDemoBotCommands: TelegramBot.BotCommand[] = [
  { command: "help", description: "Was kann der Bot?" },
  { command: "hi", description: "Sag Hallo" },
];

export default telegramDemoBotCommands;
