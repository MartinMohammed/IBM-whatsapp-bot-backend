import { IListenerTextMessage } from "node-whatsapp-bot-api";
import Constants from "../../Constants";
import logger from "../../../logger";
import User from "../../../models/mongoDB/schemas/User";
import IWhatsappMessage from "../../../models/mongoDB/types/WhatsappMessage";

/**
 * Handles incoming text messages.
 * @param textMessage The incoming text message.
 */
export async function textMessageHandler(textMessage: IListenerTextMessage) {
  logger.info(
    "Now broadcasting the received WhatsApp message to whitelisted chats."
  );
}
