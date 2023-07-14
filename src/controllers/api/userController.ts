import express from "express";
import User from "../../models/mongoDB/schemas/User";
import logger from "../../logger";
import UserModelType, { IUser } from "../../customTypes/models/User";
import Constants from "../../utils/Constants";
import getWhatsappBot from "../../utils/whatsappBot/init";
import { WhatsappMessageStoredType } from "../../customTypes/models/WhatsappMessagesStored";
import getUnixTimestamp from "../../utils/getUnixTimestamp";
import {getUser} from "../../models/mongoDB/UserRepository"

const whatsappBot = getWhatsappBot();

/**
 * Controller for handling operations related to the users resource.
 */

/**
 * Retrieve all users from the database.
 */
export async function getUsers(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const userRefs = await User.find({})
      .select(["name", "wa_id", "whatsapp_messages", "_id"])
      .lean();

    // Convert the _id field to string format:
    userRefs.forEach((userRef) => (userRef._id = userRef._id.toString()));

    logger.info("Successfully retrieved all users from the database.");
    res.status(200).json(userRefs);
  } catch (error) {
    logger.error("Failed to retrieve users from the database.", error);
    res.sendStatus(500);
  }
}

export async function getMessagesOfUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const wa_id = req.params.userId;
  const userRef = await getUser(wa_id);
  if (!userRef) {
    logger.error(`Document of user with wa_id ${wa_id} not found in the database.`);
    return res.status(500).json({ message: "Document not found in the database." });
  }
  logger.verbose(`Document with wa_id ${wa_id} was fetched for receiving his whatsapp_messages.`);
  res.status(200).json(userRef.whatsapp_messages);
}

/**
 * Add a new message to a user's messages array.
 */
export async function postMessageToUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const wa_id = req.params.userId;
  const body: { text: string } = req.body;
  if (body.text.length === 0) {
    logger.warn(`Text message is not allowed to have a length of 0`);
    return res.status(400).json({ message: "Text message is not allowed to have a length of 0" });
  }

  let userRef = await getUser(wa_id)
  if (!userRef) {
    logger.error(`Document of user with wa_id ${wa_id} not found in the database.`);
    return res.status(500).json({ message: "Document not found in the database." });
  }
  // Get the phone number of the whatsapp user:
  const recipient = userRef.whatsapp_messages[0].wa_id;
  const wam_id = await whatsappBot.sendTextMessage(body.text, recipient);

  // Expect that the wam_id is provided if the whatsapp bot request was successful.
  if (wam_id && Constants.phoneNumber) {
    // Message sent by us.
    const newWhatsappMessage: WhatsappMessageStoredType = {
      text: body.text,
      wa_id: Constants.phoneNumber,
      wam_id,
      sentByClient: true,
      timestamp: getUnixTimestamp(),
    };
    userRef.whatsapp_messages.push(newWhatsappMessage);
  } else {
    logger.warn("Whatsapp Bot has not provided a wam_id for the message it sent.");
    return res.status(500).json({ message: "Failed to send text message with whatsappbot." });
  }

  try {
    await userRef.save();
    logger.info(`Successfully appended new whatsapp message to the users array.`);
  } catch (error) {
    logger.error(`Failed to push new WhatsApp message to user document: ${error}.`);
    return res.status(500).json({ message: "Failed to push new WhatsApp message to user document." });
  }

  res.sendStatus(200);
}
