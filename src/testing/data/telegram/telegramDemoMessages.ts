import TelegramBot from "node-telegram-bot-api";

/**
 * Messages based on TelegramBot.Message interface
 */

/** Contains only the required fields. */
export const telegramDemoMessageLean: TelegramBot.Message = {
  /**
   * The unique identifier of the message
   */
  message_id: 1,
  /**
   * The sender of the message
   */
  from: {
    /**
     * The unique identifier of the sender
     */
    id: 123456789,
    /**
     * Flag indicating whether the sender is a bot or not
     */
    is_bot: false,
    /**
     * The first name of the sender
     */
    first_name: "test",
  },
  /**
   * The chat where the message was sent
   */
  chat: {
    /**
     * The unique identifier of the chat
     */
    id: 123456789,
    /**
     * The type of the chat (e.g., "private", "group", "channel")
     */
    type: "private",
  },
  /**
   * The date and time when the message was sent (Unix timestamp)
   */
  date: 1688566145,
};

/**
 * Telegram bot command message for the demo bot.
 */
export const telegramDemoBotCommandMessage: TelegramBot.Message = {
  /**
   * Inherits fields from telegramDemoMessageLean
   */
  ...telegramDemoMessageLean,
  /**
   * The text of the command message
   */
  text: "/hi",
  /**
   * Additional entities present in the command message
   */
  entities: [
    {
      /**
       * The type of the entity (e.g., "bot_command")
       */
      type: "bot_command",
      /**
       * The offset of the entity in the message text
       */
      offset: 0,
      /**
       * The length of the entity in the message text
       */
      length: 3,
    },
  ],
};
