import { IListenerTextMessage } from "node-whatsapp-bot-api";
import Constants from "../../Constants";
import logger from "../../../logger";
import sendTextMessageWrapper from "../../telegramBot/messagingFeatures/telegramSendTextMessageWrapper";

/**
 * Handles incoming text messages.
 * @param textMessage The incoming text message.
 */
export function textMessageHandler(textMessage: IListenerTextMessage) {
  logger.info(
    "Now broadcasting the received WhatsApp message to whitelisted chats."
  );

  /* istanbul ignore next */
  Constants.MESSAGE_WHITE_LIST.forEach(async (telegramChatId) => {
    // Includes built-in error handling.

    await sendTextMessageWrapper(
      telegramChatId,
      `Hi, wir haben eine neue Nachricht von ${textMessage.from} erhalten.\n\nDie Nachricht lautet: '${textMessage.text.body}'.\n\nWenn du darauf antworten möchtest, swipe die Nachricht nach link und antworte.`
    );
  });
}
