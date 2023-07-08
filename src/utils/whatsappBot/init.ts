import TelegramBot from "node-telegram-bot-api";
import telegramBot from "../telegramBot/init";
import { ITextMessage } from "./processWebhookPayload/types/message";
import { SupportedWhatsappMessages } from "./types/supportedWhatsappMessages";
import WhatsappBot from "whatsapp-cloud-api-bot-express";

const whatsappBot = new WhatsappBot(
  process.env.USER_ACCESS_TOKEN,
  process.env.PHONE_NUMBER_ID
);
whatsappBot.on(SupportedWhatsappMessages.TEXT, (textMessage: ITextMessage) => {
  whatsappBot.sendTextMessage("hi", textMessage.from);
});
whatsappBot.on("error" as SupportedWhatsappMessages.TEXT, (error) => {
  console.log(error);
});
export default whatsappBot;
