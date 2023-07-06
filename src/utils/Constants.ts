import TelegramBot, { BotCommand } from "node-telegram-bot-api";

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

/** Array of bot commands */
// Will be updated when initializing the TelegramBot.
let BOT_COMMANDS: Array<BotCommand> = [];
// ------------------------- RELATED TO TELEGRAM -------------------------

export default {
  FacebookBaseUrl,
  PhoneNumberID,
  MetaGraphAPIVersion,
  MESSAGE_WHITE_LIST,
  BOT_COMMANDS,
};
