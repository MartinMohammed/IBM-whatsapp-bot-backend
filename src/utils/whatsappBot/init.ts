import WhatsappBot, {
  SupportedWhatsappMessageTypes,
} from "node-whatsapp-bot-api";
import { textMessageHandler } from "./listenerHandlers/textMessageHandler";

// Create a new instance of WhatsappBot
// using the provided user access token and phone number ID.
const whatsappBot = new WhatsappBot(
  process.env.NODE_ENV === "test"
    ? "SECRET_HUB_VERIFY_TOKEN"
    : process.env.HUB_VERIFY_TOKEN,
  process.env.NODE_ENV === "test"
    ? "SECRET_META_API_TOKEN"
    : process.env.META_API_TOKEN,
  process.env.NODE_ENV === "test"
    ? "SECRET_PHONE_NUMBER_ID"
    : process.env.PHONE_NUMBER_ID
);

// Note: No event listeners are registered when running in test mode
// to avoid unexpected behavior during testing.

// Register event listeners for handling incoming text messages.
// When a text message is received, the bot sends a text message back to the sender.
// The event listener uses the `sendTextMessage` method of the WhatsappBot instance.
if (process.env.NODE_ENV !== "test") {
  /* istanbul ignore next */
  whatsappBot.on(SupportedWhatsappMessageTypes.TEXT, textMessageHandler);
}

// Register an event listener for handling errors.
// If an error occurs, it is logged to the console.
/** If not provided, at every this.emit() a error is thrown within it's context. */
whatsappBot.on("error" as SupportedWhatsappMessageTypes.TEXT, (error) => {
  if (process.env.NODE_ENV !== "test") {
  } // handle error
});

// Export the WhatsappBot instance as the default export of this module.
// This allows other modules to import and use the WhatsappBot instance.
export default whatsappBot;
