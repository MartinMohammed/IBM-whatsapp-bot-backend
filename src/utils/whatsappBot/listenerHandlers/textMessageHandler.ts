import { IListenerTextMessage } from "node-whatsapp-bot-api";
import logger from "../../../logger";
import User from "../../../models/mongoDB/schemas/User";
import UserModelType from "../../../customTypes/models/User";
import { WhatsappMessageStoredType } from "../../../customTypes/models/WhatsappMessagesStored";

/**
 * Handles incoming text messages from whatsapp bot.
 * @param textMessage The incoming text message.
 */
export async function textMessageHandler(textMessage: IListenerTextMessage) {
  try {
    const { contact, message_id, text, timestamp } = textMessage;

    // Save the message into the database
    const whatsappMessage: WhatsappMessageStoredType = {
      text: text.body,
      wa_id: contact.wa_id,
      wam_id: message_id,
      timestamp: timestamp,
      sentByClient: true, 
    };

    // Check if the user already exists in the database
    const user = await User.findOne({ wa_id: contact.wa_id });

    if (!user) {
      // Create a new user and save their first message
      const newUser: UserModelType = new User({
        name: contact.profile.name,
        wa_id: contact.wa_id,
        whatsapp_messages: [whatsappMessage],
      });
      await newUser.save();
      logger.info(
        `Successfully created a new user (${contact.wa_id}) in the database users collection`
      );
      return;
    } else {
      logger.info(`User ${contact.wa_id} does already exists.`);
      // User already exists, push the new message to their array
      user.whatsapp_messages.push(whatsappMessage);
      await user.save();
    }
  } catch (error) {
    logger.error(`Failed to handle incoming text message: ${error}`);
  }
}
