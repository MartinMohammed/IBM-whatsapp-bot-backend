import whatsappBotMiddlewareForEmittingEvents from "../middlewares/whatsappBot";
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

export default router;
