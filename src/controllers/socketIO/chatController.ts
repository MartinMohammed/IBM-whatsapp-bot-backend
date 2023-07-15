/** Controller for the '/messages' namespace */
import {
  IListenerTextMessage,
  SupportedWhatsappMessageTypes,
} from "node-whatsapp-bot-api";
import { ChatSocket } from "../../customTypes/socketIO/chatNamespace";
import logger from "../../logger";
import getWhatsappBot from "../../utils/whatsappBot/init";
import { IWhatsappTextMessageFromServer } from "../../customTypes/socketIO/messages";
import { IClientStoredContact } from "../../customTypes/socketIO/contact";
import User from "../../models/mongoDB/schemas/User";
import { UsersFilterList } from "../../app";
import { getUser } from "../../models/mongoDB/UserRepository";

const bot = getWhatsappBot();

/** Responsible for handling incoming connection for socket */
function messagesController(serverSocket: ChatSocket) {
  logger.info(`Received a socket connection: ${serverSocket.id}.`);
  // Listen for incoming whatsapp messages.
  logger.info(`Received a socket connection: ${serverSocket.id}.`);

  // Listen for incoming whatsapp messages.
  bot.on(
    SupportedWhatsappMessageTypes.TEXT,
    (message: IListenerTextMessage) => {
      // Only forward messages to the specific client if they are interested
      if (serverSocket.data.currentChatUser === message.contact.wa_id) {
        // Prepare the whatsapp message to be emitted to the client
        const whatsappMessageFromServer: IWhatsappTextMessageFromServer = {
          wa_id: message.contact.wa_id,
          text: message.text.body,
          timestamp: message.timestamp,
          wam_id: message.message_id,
          sentByClient: true,
        };

        logger.verbose(
          `Received a text message for the client watching the currentChatUser.`
        );
        serverSocket.emit("message", whatsappMessageFromServer);
        return;
      }

      // Handle messages received from different users
      logger.verbose(
        `Received a text message, but it is not from the currentChatUser.`
      );

      // Get the ObjectId of the message
      const queryFilter: UsersFilterList = ["whatsappProfileImage"];

      getUser(message.contact.wa_id)

        getUser(message.contact.wa_id, queryFilter)
        .then((userRef) => {
          if (userRef === null) {
            throw new Error(`userRef is null while fetching the user whatsapp profile image.`);
          }
          if (userRef.whatsappProfileImage === undefined) {
            throw new Error("Whatsapp Profile image is undefined.");
          }

          // Prepare the contact information to be emitted to the client
          const clientStoredContact: IClientStoredContact = {
            wa_id: message.contact.wa_id,
            name: message.contact.profile.name,
            // TODO: Set the whatsappProfileImage value
            whatsappProfileImage: userRef.whatsappProfileImage,
          };
          serverSocket.emit("contact", clientStoredContact);
        })
        .catch((error) => {
          logger.error(
            `An error occurred while fetching the whatsapp profile image of ${message.contact.wa_id}. ${error}`
          );
        });
    }
  );

  /** Called when the user switched chat in the left pane */
  serverSocket.on("chatSwitch", (wa_id) => {
    // Update the currentChatUser stored in the serverSocket
    // in order to send new messages only for this particular whatsapp user.
    logger.info(
      `Socket User ${serverSocket.id} has switched the chat from ${serverSocket.data.currentChatUser} to ${wa_id}.`
    );
    serverSocket.data.currentChatUser = wa_id;
  });

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

        /** Save the new message to the Clients whatsapp messages array: */
        try {
          const userRef = await User.findOne({ wa_id: message.wa_id });
          // Store the message send by the whatsapp dashboard and add wamid
          if (!userRef) {
            logger.error(
              `User with wa_id ${message.wa_id} was not found. Append new whatasapp message failed.`
            );
          } else {
            // Append the new message.
            userRef?.whatsapp_messages.push({
              ...message,
              wam_id,
              sentByClient: false,
            });
            await userRef.save();
            logger.verbose(
              `New message was created and appended to ${message.wa_id}.`
            );
          }
        } catch (error) {
          logger.error(
            `Failed to append a new whatsapp message to ${message.wa_id}.`
          );
        }
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
