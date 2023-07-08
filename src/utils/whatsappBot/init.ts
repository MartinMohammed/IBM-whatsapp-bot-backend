import WhatsappBot from "whatsapp-cloud-api-bot-express";
import { SupportedWhatsappMessageTypes } from "whatsapp-cloud-api-bot-express";

const whatsappBot = new WhatsappBot(
  process.env.USER_ACCESS_TOKEN,
  process.env.PHONE_NUMBER_ID
);
whatsappBot.on(SupportedWhatsappMessageTypes.TEXT, (textMessage) => {
  whatsappBot.sendTextMessage(textMessage.text.body, textMessage.from);
});
whatsappBot.on("error" as SupportedWhatsappMessageTypes.TEXT, (error) => {
  console.log(error);
});
export default whatsappBot;
