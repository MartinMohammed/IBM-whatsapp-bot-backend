/** Controller for the '/messages' namespace */
import {
  IListenerTextMessage,
  SupportedWhatsappMessageTypes,
} from "node-whatsapp-bot-api";
import { MessagesSocket } from "../../customTypes/socketIO/messagesNamespace";
import logger from "../../logger";
import getWhatsappBot from "../../utils/whatsappBot/init";

const bot = getWhatsappBot();

/** Responsible for handling incoming connection for socket */
function messagesController(serverSocket: MessagesSocket) {
  logger.info(`Received a socket connection: ${serverSocket.id}.`);

  // Listen for incoming whatsapp messages.
  bot.on(
    SupportedWhatsappMessageTypes.TEXT,
    (message: IListenerTextMessage) => {
      serverSocket.emit("message", message);
    }
  );
  // Register event listener
  serverSocket.on("message", (message) => {
    // Send the received message from the client directly to the user's whatsapp chat.
    logger.info(
      `Received a whatsapp message from the client to send: ${message.wa_id}.`
    );
    bot.sendTextMessage(message.text, message.wa_id);
  });

  serverSocket.on("disconnect", () => {
    logger.info(`${serverSocket.id} disconnected from the socket connection.`);
  });
}

export default messagesController;
