import express from "express";
import {
  verifyWebhook,
  receiveMessages,
} from "../controllers/webhookController";

const router = express.Router();

// Handle the GET request on the "/webhook" endpoint.
// Verify the callback URL from the dashboard side (Cloud API side).
router.get("/", verifyWebhook);

// Handle events, e.g., receive messages.
router.post("/", receiveMessages);

export default router;
