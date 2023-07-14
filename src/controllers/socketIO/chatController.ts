/** Controller for the '/messages' namespace */
import {
  IListenerTextMessage,
  SupportedWhatsappMessageTypes,
} from "node-whatsapp-bot-api";
import { ChatSocket } from "../../customTypes/socketIO/chatNamespace";
import logger from "../../logger";
import getWhatsappBot from "../../utils/whatsappBot/init";
import { IWhatsappTextMessageFromServer } from "../../customTypes/socketIO/messages";
import { IClientStoredContact } from "../../customTypes/socketIO/contacts";

const bot = getWhatsappBot();

/** Responsible for handling incoming connection for socket */
function messagesController(serverSocket: ChatSocket) {
  logger.info(`Received a socket connection: ${serverSocket.id}.`);
  // Listen for incoming whatsapp messages.
  bot.on(
    SupportedWhatsappMessageTypes.TEXT,
    (message: IListenerTextMessage) => {
      // Only forward messages to the specific client if he is really interested in
      if (serverSocket.data.currentChatUser === message.contact.wa_id) {
        // A whatsapp message should be emitted to the Client
        const whatsappMessageFromServer: IWhatsappTextMessageFromServer = {
          wa_id: message.contact.wa_id,
          text: message.text.body,
          timestamp: message.timestamp,
          wam_id: message.message_id,
          sentByClient: true,
        };

        logger.verbose(
          `Received a text message for the client watching on currentChatUser.`
        );
        serverSocket.emit("message", whatsappMessageFromServer);
        return;
      } else {
        logger.verbose(
          `Received a text message but is not the currentChatUser.`
        );

        // Get hold of the ObjectId of that particular message. 
        const clientStoredContact: IClientStoredContact = {
          wa_id: message.contact.wa_id,
          name: message.contact.profile.name,

        };
        serverSocket.emit("contact", clientStoredContact);
      }
    }
  );

  // Register event listener
  serverSocket.on("message", async (message, cb) => {
    // Send the received message from the client directly to the user's whatsapp chat.
    logger.info(
      `Received a whatsapp message from the client to send: ${message.wa_id}.`
    );
    try {
      // Send whatsapp message to user.
      const wam_id = await bot.sendTextMessage(message.text, message.wa_id);
      // Make sure we received a wamid before sending back to client.
      if (wam_id) {
        // Provide the wam_id back to the user.
        logger.info(`Wamid was provided back to the client.`);
        cb(wam_id);
      } else {
        logger.error(
          `No wamid was provided when sending textMessage to client.`
        );
      }
    } catch (error) {
      logger.error(
        `Failed to send text message after receiving socket message from client: ${error}.`
      );
      logger.debug(`The message that as send: ${JSON.stringify(message)}`);
    }
  });

  serverSocket.on("disconnect", () => {
    logger.info(`${serverSocket.id} disconnected from the socket connection.`);
  });
}

export default messagesController;
