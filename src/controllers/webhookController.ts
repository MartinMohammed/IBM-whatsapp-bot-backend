import { Request, Response } from "express";
import { processWebhookPayload } from "../utils/processWebhookPayload/processWebhookPayload";
import { IWebhookMessagesPayload } from "../utils/processWebhookPayload/types/webhookMessagesPayload";

// Verify the webhook URL with WhatsApp
function verifyWebhook(req: Request, res: Response): void {
  const appToken = process.env.VERIFY_TOKEN;
  // Extract the values of hub.mode, hub.challenge, and hub.verify_token from the request query
  const {
    "hub.mode": hubMode,
    "hub.challenge": hubChallenge,
    "hub.verify_token": hubVerifyToken,
  } = req.query;

  console.log("app token: ", appToken);

  // Check if the hub.mode is "subscribe" and the hub.verify_token matches the appToken
  if (hubMode === "subscribe" && hubVerifyToken === appToken) {
    // Return the hub.challenge value to complete the verification process
    res.status(200).send(hubChallenge);
  } else {
    // If there is a mismatch in hub.mode or hub.verify_token, return a forbidden status
    console.log("Mismatch of hubMode or hubVerifyToken.");
    res.sendStatus(403);
  }
}

// Receive incoming messages from WhatsApp
function receiveMessages(req: Request, res: Response): void {
  const body: IWebhookMessagesPayload = req.body;
  console.log(JSON.stringify(body, null, 2));

  if (
    body.object == "whatsapp_business_account" &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  ) {
    res.sendStatus(200);
    // Process the received webhook payload
    processWebhookPayload(body);
  } else {
    // If the necessary fields are not present, consider the event as not from the WhatsApp API
    res.sendStatus(404);
  }
}

export { verifyWebhook, receiveMessages };
