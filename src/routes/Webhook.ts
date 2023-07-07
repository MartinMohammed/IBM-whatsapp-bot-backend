import express from "express";
import {
  verifyWebhook,
  receiveChanges,
} from "../controllers/webhookController";
import { IWebhookMessagesPayload } from "../utils/whatsappBot/processWebhookPayload/types/webhookMessagesPayload";
import { SupportedWhatsappMessages } from "../utils/whatsappBot/types/supportedWhatsappMessages";
import whatsappBot from "../utils/whatsappBot/init";

const router = express.Router();

// Handle the GET request on the "/webhook" endpoint.
// Verify the callback URL from the dashboard side (Cloud API side).
router.get("/", verifyWebhook);

// Handle events, e.g., receive messages.
router.post("/", whatsappBotMiddlewareForEmittingEvents, receiveChanges);

// Middleware for emitting events to the WhatsApp bot
function whatsappBotMiddlewareForEmittingEvents(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Extract necessary data from the request body
  const { object, entry }: IWebhookMessagesPayload = req.body;
  // Check if the required data is present to emit the event
  console.log("hi");
  if (
    object === "whatsapp_business_account" &&
    entry &&
    entry[0]?.changes &&
    entry[0]?.changes[0] &&
    entry[0]?.changes[0]?.value?.messages &&
    entry[0]?.changes[0]?.value?.messages[0]
  ) {
    console.log("whatsapp bot is: ", whatsappBot);
    console.log(process.env.NODE_ENV);
    // Emit the event to the WhatsApp bot
    whatsappBot?.emit(
      SupportedWhatsappMessages.TEXT,
      entry[0]!.changes[0]!.value!.messages[0]
    );
  }

  // Continue on the middleware stack
  next();
}

// Apply the middleware for emitting events to the WhatsApp bot
router.use(whatsappBotMiddlewareForEmittingEvents);

export default router;
