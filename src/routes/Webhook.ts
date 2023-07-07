import express from "express";
import {
  verifyWebhook,
  receiveChanges,
} from "../controllers/webhookController";
import whatsappBot from "../utils/whatsappBot/init";
import { SupportedWhatsappMessages } from "../utils/whatsappBot/types/supportedWhatsappMessages";
import { IWebhookMessagesPayload } from "whatsapp-cloud-api-bot-express/dist/types/customTypes/webhookPayload/webhookMessagesPayload";

const router = express.Router();

// Handle the GET request on the "/webhook" endpoint.
// Verify the callback URL from the dashboard side (Cloud API side).
router.get("/", verifyWebhook);

// Handle events, e.g., receive messages.
router.post(
  "/",
  (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    // Custom validation if needed.
    if (request.body) {
      whatsappBot?.middlewareHandlerForWebhookMessagesPayload(
        request.body as IWebhookMessagesPayload
      );
    }
    next();
  },
  receiveChanges
);

export default router;
