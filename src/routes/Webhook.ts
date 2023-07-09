import express from "express";
import whatsappBot from "../utils/whatsappBot/init";
import telegramBot from "../utils/telegramBot/init";
import logger from "../logger";

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

// ----------------- FOR TELEGRAM -----------------
router.post(
  `/telegram/bot${process.env.TELEGRAM_API_TOKEN}`,
  (req, res, next) => {
    logger.info(`Received a new telegram message from POST request.`);
    // Emit new changes to listeners.
    telegramBot?.processUpdate(req.body);
    res.sendStatus(200);
  }
);
// ----------------- FOR TELEGRAM -----------------

export default router;
