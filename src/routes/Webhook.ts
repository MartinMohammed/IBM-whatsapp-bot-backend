import express from "express";
import whatsappBot from "../utils/whatsappBot/init";

const router = express.Router();

// ----------------- FOR WHATSAPP -----------------
// Handle the GET request on the "/webhook" endpoint.
// Verify the callback URL from the dashboard side (Cloud API side).
router.get("/whatsapp", (req, res, next) => {
  whatsappBot.middlewareHandlerForWebhookVerification(req, res, next);
  // Next middleware if there is one.
});

// Handle events, e.g., receive messages.
router.post(
  "/whatsapp",
  (req, res, next) =>
    // ! bind this
    whatsappBot.middlewareHandlerForWebhookMessagesPayload(req, res, next)
  // Next middleware if there is one .
);
// ----------------- FOR WHATSAPP -----------------

export default router;
