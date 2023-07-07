import TelegramBot from "node-telegram-bot-api";
import {
  SupportedTelegramActionType,
  SupportedTelegramActions,
} from "../types/supportedTelegramActions";
import logger from "../../../../../logger";

/** Handle the telegram actions defined in `supportedTelegramActions`  */
function actionHandler(
  message: TelegramBot.Message,
  action: SupportedTelegramActionType
) {
  switch (action) {
    case SupportedTelegramActions.SEND_WHATSAPP_MESSAGE:
      logger.verbose(`Received action to send whatsapp message.`);
      break;

    default:
      const _exhaustiveCheck: never = action;
      logger.warn(`Unhandled telegram action: '${action}'.`);
  }
}

export default actionHandler;
