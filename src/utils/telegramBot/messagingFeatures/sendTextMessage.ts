import TelegramBot from "node-telegram-bot-api";
import telegramBot from "..";
import logger from "../../../logger";

export async function sendTextMessage(
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
