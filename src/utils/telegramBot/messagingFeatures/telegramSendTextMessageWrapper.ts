import TelegramBot from "node-telegram-bot-api";
import telegramBot from "../init";
import logger from "../../../logger";

/**
 * Sends a text message to a specified chat using the Telegram Bot API.
 * @param chatId The ID of the chat to send the message to.
 * @param text The text message to send.
 * @param options Additional options for sending the message (optional).
 */
async function sendTextMessageWrapper(
  chatId: TelegramBot.ChatId,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  try {
    const sentMessage = await telegramBot?.sendMessage(chatId, text, options);
    logger.info(`Message to chatId ${chatId} was sent successfully.`);
  } catch (error) {
    logger.error(`Sending message to chatId ${chatId} failed.`);
  }
}

export default sendTextMessageWrapper;
