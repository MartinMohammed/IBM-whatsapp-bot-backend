import TelegramBot from "node-telegram-bot-api";
import logger from "../../../../logger";
import { authorizeSender } from "../../util/authorizeSender";

/*
Inline Queries: An inline query is when a user types a query directly in the 
chat input field and sends it to the bot. The bot receives this query and can 
provide immediate results within the chat interface. For example, if a user 
types "@botname search something" in the chat input field, it triggers an 
inline query. The bot can then process the query and respond with relevant 
results that appear inline within the chat interface, usually in the form of 
selectable options.
*/
export function onInlineQueryHandler(query: TelegramBot.InlineQuery) {
  logger.info("Received an inline query:", query);
  const senderIsUnauthorized = !authorizeSender(
    query.from,
    "Listener tried to access: 'onInlineQueryHandler'"
  );
  if (senderIsUnauthorized) {
    return false; // Stop further processing
  }

  // Process the inline query and provide relevant results if needed.
}
