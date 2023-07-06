import TelegramBot from "node-telegram-bot-api";

/**
 * Set up a demo user
 */
const telegramDemoUser: TelegramBot.User = {
  /**
   * The first name of the user
   * @type {string}
   */
  first_name: "test",

  /**
   * The unique Telegram ID of the user
   * @type {number}
   */
  id: 123456789,

  /**
   * Flag indicating whether the user is a bot or not
   * @type {boolean}
   */
  is_bot: false,
};

export default telegramDemoUser;
