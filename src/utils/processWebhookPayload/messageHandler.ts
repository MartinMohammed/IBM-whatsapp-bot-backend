import { sendTextMessage } from "../messagingFeatures/sendTextMessage";
import { ITextObject } from "../messagingFeatures/types/textMessage";
import { IValue } from "./types/change";
import { IMessage, ITextMessage, MessageTypes } from "./types/message";
import logger from "../../logger";

/**
 * Handles different types of messages by logging their properties and sending a response.
 * @param message - The message to handle.
 * @param metadata - The metadata associated with the message.
 */
export function messageHandler(
  message: IMessage,
  metadata: IValue["metadata"]
) {
  logger.info("Handling message:", { message, metadata });

  const isReplyMessage = repliedToMessage(message);
  if (isReplyMessage) {
    logger.info("Message is a reply to another message.", {
      messageId: message.context!.message_id,
      from: message.context!.from,
    });
  }

  switch (message.type) {
    case MessageTypes.TEXT:
      // Handle text messages
      const textMessage = message as ITextMessage;
      logger.info("Received text message:", { body: textMessage.text.body });

      // Send a text message back
      const responseText: string = `Echo: ${
        textMessage.text.body
      }\nYou are Phone Number: ${message.from}\nYour last WAMID: ${
        message.id
      }\nThe date of the last message: ${new Date(
        +message.timestamp * 1000
      ).toLocaleString()}`;
      sendResponseMessage(message.from, responseText);
      break;

    // TODO: Handle other message types

    // TODO: IMPLEMENT
    case MessageTypes.REACTION:
      // Handle reaction messages
      // const reactionMessage = message as IReactionMessage;
      // console.log("Reaction Message ID:", reactionMessage.reaction.message_id);
      // console.log("Emoji:", reactionMessage.reaction.emoji);
      break;

    case MessageTypes.IMAGE:
      // Handle image messages
      // const imageMessage = message as IImageMessage;
      // console.log("Image Caption:", imageMessage.image.caption);
      // console.log("Image MIME Type:", imageMessage.image.mime_type);
      // console.log("Image SHA256:", imageMessage.image.sha256);
      // console.log("Image ID:", imageMessage.image.id);
      break;

    // Do nothing yet.
    case MessageTypes.BUTTON:
    case MessageTypes.INTERACTIVE:
    case MessageTypes.ORDER:
    case MessageTypes.STICKER:
    case MessageTypes.SYSTEM:
    case MessageTypes.UNKOWN:
    case MessageTypes.UNSUPPORTED:
      break;

    default:
      const _exhaustiveCheck: never = message.type;
      throw Error("Unknown Message Type: " + message.type);
  }
}

/**
 * Sends a text response message to the specified recipient.
 * @param recipient - The recipient of the response message.
 * @param text - The text content of the response message.
 */
function sendResponseMessage(recipient: string, text: string) {
  const textObject: ITextObject = {
    to: recipient,
    recipient_type: "individual",
    messaging_product: "whatsapp",
    type: MessageTypes.TEXT,
    text: {
      preview_url: false,
      body: text,
    },
  };
  sendTextMessage(textObject);
}

/**
 * Checks if a message is a reply to another message.
 * @param message - The message to check.
 * @returns A boolean indicating whether the message is a reply.
 */
export function repliedToMessage(message: IMessage): boolean {
  return "context" in message ? true : false;
}
