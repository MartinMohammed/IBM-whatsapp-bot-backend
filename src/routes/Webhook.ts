import express from "express";
import {
  verifyWebhook,
  receiveChanges,
} from "../controllers/webhookController";
import whatsappBot from "../utils/whatsappBot/init";

const router = express.Router();

// Handle the GET request on the "/webhook" endpoint.
// Verify the callback URL from the dashboard side (Cloud API side).
router.get("/", verifyWebhook);

// Handle events, e.g., receive messages.
router.post(
  "/",
  (req, res, next) =>
    // ! bind this
    whatsappBot.middlewareHandlerForWebhookMessagesPayload(req, res, next)
  // Next middleware if there is one .
);

export default router;
