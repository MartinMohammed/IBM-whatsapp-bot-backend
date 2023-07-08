import WhatsappBot from "whatsapp-cloud-api-bot-express";
import { SupportedWhatsappMessageTypes } from "whatsapp-cloud-api-bot-express";

// Create a new instance of WhatsappBot
// using the provided user access token and phone number ID.
const whatsappBot = new WhatsappBot(
  process.env.USER_ACCESS_TOKEN,
  process.env.PHONE_NUMBER_ID
);

// Note: No event listeners are registered when running in test mode
// to avoid unexpected behavior during testing.

// Register event listeners for handling incoming text messages.
// When a text message is received, the bot sends a text message back to the sender.
// The event listener uses the `sendTextMessage` method of the WhatsappBot instance.
if (process.env.NODE_ENV !== "test") {
  whatsappBot.on(SupportedWhatsappMessageTypes.TEXT, (textMessage) => {
    whatsappBot.sendTextMessage(textMessage.text.body, textMessage.from);
  });

  // Register an event listener for handling errors.
  // If an error occurs, it is logged to the console.
  whatsappBot.on("error" as SupportedWhatsappMessageTypes.TEXT, (error) => {
    console.log(error);
  });
}

// Export the WhatsappBot instance as the default export of this module.
// This allows other modules to import and use the WhatsappBot instance.
export default whatsappBot;
