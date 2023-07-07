import { sendTextMessage } from "../telegramBot/messagingFeatures/telegramSendTextMessage";
import { SupportedWhatsappMessages } from "./types/supportedWhatsappMessages";
import WhatsappBot from "whatsapp-cloud-api-bot-express";

let whatsappBot: WhatsappBot | undefined;

if (process.env.NODE_ENV !== "test") {
  whatsappBot = new WhatsappBot(
    process.env.USER_ACCESS_TOKEN,
    process.env.PHONE_NUMBER_ID
  );
  whatsappBot.on(SupportedWhatsappMessages.TEXT, (textMessage) => {});
}

export default whatsappBot;
