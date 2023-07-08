import { Request, Response } from "express";
import logger from "../logger";
import { MetaVerificationFields } from "../utils/whatsappBot/types/metaWebhookVerification";

// Initialize the whatsapp bot to listen for new messages

/**
 * Verify the webhook URL with WhatsApp.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export function verifyWebhook(req: Request, res: Response): void {
  const appToken = process.env.VERIFY_TOKEN;

  // Extract the values of hub.mode, hub.challenge, and hub.verify_token from the request query
  const {
    [MetaVerificationFields.HUB_MODE]: hubMode,
    [MetaVerificationFields.HUB_CHALLENGE]: hubChallenge,
    [MetaVerificationFields.HUB_VERIFY_TOKEN]: hubVerifyToken,
  } = req.query;

  // Check if the hub.mode is "subscribe" and the hub.verify_token matches the appToken
  if (hubMode === "subscribe" && hubVerifyToken === appToken) {
    const message = "Received 'GET' request to '/webhook'. Status Code: '200'.";
    logger.http(message);

    // Return the hub.challenge value to complete the verification process
    res.status(200).send(hubChallenge);
  } else {
    const message = "Received 'GET' request to '/webhook'. Status Code: '403'.";
    logger.http(message);

    // If there is a mismatch in hub.mode or hub.verify_token, return a forbidden status
    logger.warn("Mismatch of hubMode or hubVerifyToken.");
    res.sendStatus(403);
  }
}
