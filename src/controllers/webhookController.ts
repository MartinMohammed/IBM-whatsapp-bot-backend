import { Request, Response } from "express";
import { processWebhookPayload } from "../utils/processWebhookPayload/processWebhookPayload";

const appToken = process.env.VERIFY_TOKEN;

function verifyWebhook(req: Request, res: Response): void {
  const {
    "hub.mode": hubMode,
    "hub.challenge": hubChallenge,
    "hub.verify_token": hubVerifyToken,
  } = req.query;

  if (hubMode === "subscribe" && hubVerifyToken === appToken) {
    res.status(200).send(hubChallenge);
  } else {
    console.log("Mismatch of hubMode or hubVerifyToken.");
    res.sendStatus(403);
  }
}

function receiveMessages(req: Request, res: Response): void {
  const { body } = req;
  console.log(JSON.stringify(body, null, 2));

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].message &&
    body.entry[0].changes[0].message[0]
  ) {
    res.status(200);
    processWebhookPayload(body);
  } else {
    // Event not from the whatsapp api
    res.sendStatus(404);
  }
}

export { verifyWebhook, receiveMessages };
