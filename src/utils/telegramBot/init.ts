import TelegramBot from "node-telegram-bot-api";
import onMessageHandler from "./listenerHandlers/onMessageHandler";
import onInlineQueryHandler from "./listenerHandlers/onInlineQueryHandler";
import onCallBackQueryHandler from "./listenerHandlers/onCallbackQueryHandler";
import onErrorHandler from "./listenerHandlers/onErrorHandlers/onErrorHandler";
import onPollingErrorHandler from "./listenerHandlers/onErrorHandlers/onPollingErrorHandler";
import { fetchBotCommands } from "./util/fetchBotCommands";
import logger from "../../logger";

let telegramBot: TelegramBot | undefined;

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  // Must be included here, otherwise it doesn't stop to ask for token in order to poll.
  /**
   * Create a Telegram Bot instance using the provided API token and configure polling options.
   * The bot will listen for updates by making periodic long polling requests to the Telegram server.
   * Each long polling request stays open for a certain period of time, and if there are no updates during that time, the server responds with an empty response.
   */
  telegramBot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {
    // You can customize the polling options to control the polling behavior
    polling: {
      interval: 2000, // Set the interval between polls to 2000 milliseconds (2 seconds)
    },
  });

  // Listen for incoming messages
  /* instabul ignore next */
  telegramBot.on("message", onMessageHandler);

  // Listen for incoming inline queries
  /* instabul ignore next */
  telegramBot.on("inline_query", onInlineQueryHandler);
  // Listen for callback queries
  /* instabul ignore next */
  telegramBot.on("callback_query", onCallBackQueryHandler);

  // Listen for poll errors
  /* instabul ignore next */
  telegramBot.on("polling_error", onPollingErrorHandler);

  // Listen for general errors
  /* instabul ignore next */
  telegramBot.on("error", onErrorHandler);

  // Fetch the latest commands of the ChatBot commands
  fetchBotCommands(telegramBot);
}

/* istanbul ignore next */
if (telegramBot === undefined) logger.error("Whatsapp Bot is uninitialized.");

export default telegramBot;
