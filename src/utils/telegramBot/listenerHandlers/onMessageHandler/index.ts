import TelegramBot from "node-telegram-bot-api";
import { authorizeSender } from "../../util/authorizeSender";
import { processMessage } from "./processMessage";
import { validateReceivedMessage } from "./util/validateReceivedMessage";

/**
 * Handles incoming messages and performs the necessary actions.
 * @param message The received message.
 */
function onMessageHandler(message: TelegramBot.Message) {
  // Validate the sent message.
  if (!validateReceivedMessage(message)) {
    return; // Stop further processing
  }
  // Perform any required actions with the received message, such as processing it with Dialogflow.js or responding back to WhatsApp.

  // Authorize the sender.
  const senderIsUnauthorized = !authorizeSender(message.from);
  if (senderIsUnauthorized) return; // Stop further processing
  processMessage(message);
}

export default onMessageHandler;
