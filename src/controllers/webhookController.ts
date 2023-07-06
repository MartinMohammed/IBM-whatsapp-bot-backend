import { Request, Response } from "express";
import { processWebhookPayload } from "../utils/whatsappBot/processWebhookPayload/processWebhookPayload";
import { IWebhookMessagesPayload } from "../utils/whatsappBot/processWebhookPayload/types/webhookMessagesPayload";
import logger from "../logger";
import { MetaVerificationFields } from "../utils/whatsappBot/types/metaWebhookVerification";

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

/**
 * Receive incoming messages from WhatsApp.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export function receiveChanges(req: Request, res: Response): void {
  const body: IWebhookMessagesPayload = req.body;
  logger.debug(`Received Whatsapp Payload:  ${JSON.stringify(body, null, 2)}`);

  if (checkIfChangesContainMessage(body)) {
    const message = "Received 'POST' request to '/webhook'. Status Code: 200";
    logger.http(message);

    res.sendStatus(200);
    // Process the received webhook payload
    processWebhookPayload(body);
  } else {
    // If the necessary fields are not present, consider the event as not from the WhatsApp API
    const message = "Received 'POST' request to '/webhook'. Status Code: 404";
    logger.http(message);

    res.sendStatus(404);
  }
}

/**
 * Check if the webhook payload contains a message.
 * @param payload - The webhook payload.
 * @returns A boolean indicating if the payload contains a message.
 */
function checkIfChangesContainMessage({
  object,
  entry,
}: IWebhookMessagesPayload): boolean {
  return Boolean(
    object === "whatsapp_business_account" &&
      entry &&
      entry[0]?.changes &&
      entry[0]?.changes[0] &&
      entry[0]?.changes[0]?.value?.messages &&
      entry[0]?.changes[0]?.value?.messages[0]
  );
}
