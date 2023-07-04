import { sendTextMessage } from "../messagingFeatures/sendTextMessage";
import { ITextObject } from "../messagingFeatures/types/textMessage";
import { IValue } from "./types/change";
import {
  IMessage,
  ITextMessage,
  IReactionMessage,
  IImageMessage,
  MessageTypes,
} from "./types/message";

/**
 * Handles different types of messages by printing their properties.
 * @param message - The message to handle.
 * @param metadata - The metadata associated with the message.
 */
export function messageHandler(
  message: IMessage,
  metadata: IValue["metadata"]
) {
  console.log("From:", message.from);
  console.log("ID:", message.id);
  console.log("Timestamp:", message.timestamp);
  console.log("Type:", message.type);

  const isReplyMessage = repliedToMessage(message);
  if (isReplyMessage) {
    // The person replied to a message.
    console.log("Person replied to message: ", message.context!.message_id);
    console.log(message.context!.from); // Point of time replied to
  }

  switch (message.type) {
    case MessageTypes.TEXT:
      // Handle text messages
      const textMessage = message as ITextMessage;
      console.log("Text:", textMessage.text.body);

      // Send a text message back:
      const textObject: ITextObject = {
        to: message.from,
        recipient_type: "individual",
        messaging_product: "whatsapp",
        type: textMessage.type,
        text: {
          preview_url: false,
          body: `Echo: ${textMessage.text.body}\nYou are Phone Number: ${
            message.from
          }\nYour last WAMID: ${
            message.id
          }\nThe date of the last message: ${new Date(
            +message.timestamp * 1000
          ).toLocaleString()}`,
        },
      };
      sendTextMessage(textObject);
      break;

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

export function repliedToMessage(message: IMessage): boolean {
  return "context" in message ? true : false;
}
