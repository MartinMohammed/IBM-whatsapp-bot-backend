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
import { UsersFilterList } from "../../app";
import { getUser } from "../../models/mongoDB/UserRepository";
import socketMessageSchema from "../../utils/validation/socketMessageSchema";
import whatsappMessageFromServerSchema from "../../utils/validation/storedWhatsappMessage";

const bot = getWhatsappBot();

/** Responsible for handling incoming connection for socket */
async function messagesController(serverSocket: ChatSocket) {
  logger.info(`Received a socket connection: ${serverSocket.id}.`);

  // Listen for incoming whatsapp messages.
  bot.on(
    SupportedWhatsappMessageTypes.TEXT,
    async (message: IListenerTextMessage) => {
      let sanitizedMessage: IWhatsappTextMessageFromServer | null = null;
      try {
        sanitizedMessage = await whatsappMessageFromServerSchema.validateAsync({
          wa_id: message.contact.wa_id,
          text: message.text.body,
          timestamp: message.timestamp,
          wam_id: message.message_id,
          sentByClient: true,
        });
      } catch (error) {
        logger.error(
          `Validation of incoming WhatsApp message from bot failed. ${
            (error as { message: string }).message
          }`
        );
        return;
      }
      sanitizedMessage = sanitizedMessage as IWhatsappTextMessageFromServer;
      // Only forward messages to the specific client if they are interested
      if (serverSocket.data.currentChatUser === sanitizedMessage.wa_id) {
        logger.verbose(
          `Received a text message for the client watching the currentChatUser.`
        );
        serverSocket.emit("message", sanitizedMessage);
        return;
      }

      // Handle messages received from different users
      logger.verbose(
        `Received a text message, but it is not from the currentChatUser.`
      );
      // --------------------- EMIT THAT ANOTHER CONTACT HAS MESSAGED ---------------------
      // Get the ObjectId of the message
      // wait 2 seconds.
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 2000);
      });
      try {
        const userRef = await getUser(sanitizedMessage.wa_id, [
          "whatsappProfileImage",
        ]);
        if (userRef === null) {
          throw new Error(
            `userRef is null while fetching the user whatsapp profile image.`
          );
        }
        if (userRef.whatsappProfileImage === undefined) {
          throw new Error("Whatsapp Profile image is undefined.");
        }

        // Prepare the contact information to be emitted to the client
        const clientStoredContact: IClientStoredContact = {
          wa_id: sanitizedMessage.wa_id,

          // TODO:
          name: message.contact.profile.name,
          // TODO: Set the whatsappProfileImage value
          whatsappProfileImage: userRef.whatsappProfileImage,
          // TODO: set the unread messages to false
          // hasUnreadMessages: true,  // Received a message that is not from the currentChatUser.
        };
        serverSocket.emit("contact", clientStoredContact);
      } catch (error) {
        logger.error(
          `An error occurred while fetching the whatsapp profile image of ${message.contact.wa_id}. ${error}`
        );
      }
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
    let sanitizedMessage = null;

    try {
      sanitizedMessage = await socketMessageSchema.validateAsync(message);
    } catch (error) {
      logger.error(
        `The validation of the received WhatsApp message failed. ${
          (error as { message: string }).message
        }`
      );
      return;
    }

    logger.info(
      `Received a WhatsApp message from the client to send: ${sanitizedMessage.wa_id}.`
    );

    try {
      const wam_id = await bot.sendTextMessage(
        sanitizedMessage.text,
        sanitizedMessage.wa_id
      );

      if (wam_id) {
        logger.info(`Wamid was provided back to the client.`);
        cb(wam_id);

        try {
          const userRef = await getUser(sanitizedMessage.wa_id);

          if (!userRef) {
            logger.error(
              `User with wa_id ${sanitizedMessage.wa_id} was not found. Append new WhatsApp message failed.`
            );
          } else {
            userRef.whatsapp_messages.push({
              ...sanitizedMessage,
              wam_id,
              sentByClient: false,
            });

            await userRef.save();
            logger.verbose(
              `New message was created and appended to ${sanitizedMessage.wa_id}.`
            );
          }
        } catch (error) {
          logger.error(
            `Failed to append a new WhatsApp message to ${sanitizedMessage.wa_id}.`
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
      logger.debug(
        `The message that was sent: ${JSON.stringify(sanitizedMessage)}`
      );
    }
  });

  serverSocket.on("disconnect", () => {
    logger.info(`${serverSocket.id} disconnected from the socket connection.`);
  });

  serverSocket.on("disconnect", () => {
    logger.info(`${serverSocket.id} disconnected from the socket connection.`);
  });
}

export default messagesController;
