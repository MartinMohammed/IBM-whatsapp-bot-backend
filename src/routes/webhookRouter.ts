import express from "express";
import getWhatsappBot from "../utils/whatsappBot/init";
const whatsappBot = getWhatsappBot();

const webhookRouter = express.Router();

// ----------------- FOR WHATSAPP -----------------
// Handle the GET request on the "/webhook" endpoint.
// Verify the callback URL from the dashboard side (Cloud API side).
webhookRouter.get("/whatsapp", (req, res, next) => {
  whatsappBot.middlewareHandlerForWebhookVerification(req, res, next);
  // Next middleware if there is one.
});

// Handle events, e.g., receive messages.
webhookRouter.post(
  "/whatsapp",
  (req, res, next) =>
    // ! bind this
    whatsappBot.middlewareHandlerForWebhookMessagesPayload(req, res, next)
  // Next middleware if there is one .
);
// ----------------- FOR WHATSAPP -----------------

export default webhookRouter;
