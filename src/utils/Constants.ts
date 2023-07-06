import TelegramBot, { BotCommand } from "node-telegram-bot-api";
import {
  BotCommandsWithTemplate,
  BotCommandWithTemplateType,
} from "./telegramBot/listenerHandlers/onMessageHandler/textMessageHandler/types/supportedBotCommands";

/**
 * Represents constant values that can be used throughout the application for production.
 */

// ------------------------- RELATED TO META -------------------------
/** Base URL for Facebook Graph API */
const FacebookBaseUrl = "https://graph.facebook.com";
/** Phone number ID */
const PhoneNumberID = process.env.PHONE_NUMBER_ID;
/** Version of the Facebook Graph API */
const MetaGraphAPIVersion = "v17.0";

// ------------------------- RELATED TO META -------------------------

// ------------------------- RELATED TO TELEGRAM -------------------------
/** Array of user IDs that are allowed to interact with the telegram bot. */
// In TestMode the TelegramBot is not instantiated, so it does not need to access whitelist.
let MESSAGE_WHITE_LIST: Array<TelegramBot.User["id"]> = [];
if (process.env.NODE_ENV !== "test") {
  // Load the whitelist
  MESSAGE_WHITE_LIST = process.env.TELEGRAM_WHITELIST.replace(/,$/, "") // Remove trailing comma
    .split(",") // Split by comma
    .map((id) => +id); // Convert each element to a number
}

/**
 * Array of bot commands
 * Will be updated when initializing the TelegramBot.
 * ! Interally the commands are stored without '/' in the 'text' field.
 * */
let BOT_COMMANDS: Array<BotCommand> = [];

// ------------------------ MESSAGE TEMPLATES FOR COMMANDS ------------------------ //
// TODO: think about generaring it.
const BOT_COMMAND_MESSAGE_TEMPLATES: BotCommandWithTemplateType = {
  [BotCommandsWithTemplate.HELP]: `This chatbot allows you to interact with WhatsApp messages received by your cloud business API account. With this chatbot, you can respond to messages as if you were using WhatsApp directly. This functionality is necessary because WhatsApp does not offer an interface for cloud API usage.`,
  // Add more command message templates here if needed
};
// ------------------------ MESSAGE TEMPLATES FOR COMMANDS ------------------------ //

// ------------------------- RELATED TO TELEGRAM -------------------------

/**
 * Caution: This object should be handled with care. When using it for testing purposes,
 * make sure to reset them back as in beginning..
 */
export default {
  BOT_COMMAND_MESSAGE_TEMPLATES,
  FacebookBaseUrl,
  PhoneNumberID,
  MetaGraphAPIVersion,
  MESSAGE_WHITE_LIST,
  BOT_COMMANDS,
};
