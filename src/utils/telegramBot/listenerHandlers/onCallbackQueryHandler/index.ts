import TelegramBot from "node-telegram-bot-api";
import logger from "../../../../logger";
import { authorizeSender } from "../../util/authorizeSender";

/*
Callback Queries: A callback query occurs when a user interacts with inline 
keyboard buttons within a chat. Inline keyboard buttons are buttons that can be 
attached to messages and displayed to users. When a user taps or clicks on an 
inline keyboard button, it triggers a callback query. The bot receives this 
query and can perform specific actions or provide further information based on 
the user's selection.
*/
function onCallBackQueryHandler(query: TelegramBot.CallbackQuery) {
  logger.info("Received a callback query:", query);
  logger.info("Received an inline query:", query);
  const userIsNotAuthorized = !authorizeSender(
    query.from,
    `Listener tried to access: 'onCallBackQueryHandler'`
  );
  if (userIsNotAuthorized) return false;
  // Process the callback query and perform the necessary actions.
}

export default onCallBackQueryHandler;
