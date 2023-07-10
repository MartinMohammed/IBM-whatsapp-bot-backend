import express from "express";
import User from "../../models/mongoDB/schemas/User";
import logger from "../../logger";
import IUser from "../../models/mongoDB/types/User";
import IWhatsappMessage from "../../models/mongoDB/types/WhatsappMessage";
import Constants from "../../utils/Constants";
import whatsappBot from "../../utils/whatsappBot/init";

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
    const userRefs = await User.find();
    res.status(200).json(userRefs);
    logger.info("Successfully retrieved all users from the database.");
  } catch (error) {
    logger.error("Failed to retrieve users from the database.", error);
    res.sendStatus(500);
  }
}

/**
 * Add a new message to a user's messages array.
 */
export async function postMessageToUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const documentIdOfTheUser = req.params.userId;
  const body: { text: string } = req.body;

  // TODO: Perform validation for the message body

  let userRef: IUser | null;
  try {
    userRef = await User.findOne({ _id: documentIdOfTheUser });
    logger.info(`Successfully handled POST request to: ${req.path}`);
  } catch (error) {
    logger.error(`Failed to handle POST request to: ${req.path}`, error);
    res
      .status(500)
      .json({ message: `Failed to handle POST request to: ${req.path}` });
    return;
  }

  if (!userRef) {
    logger.error(`Document ${documentIdOfTheUser} not found in the database.`);
    return res
      .status(500)
      .json({ message: "Document not found in the database." });
  }

  const wam_id = await whatsappBot.sendTextMessage(body.text, "491794661350");
  if (wam_id) {
    const newWhatsappMessage: IWhatsappMessage = {
      text: body.text,
      wa_id: Constants.phoneNumber,
      wam_id,
    };
    userRef.whatsapp_messages.push(newWhatsappMessage);
  } else {
    throw new Error("WAM_iD of sent message is undefined.");
  }

  try {
    await userRef.save();
    logger.info("Successfully added new WhatsApp message to user document.");
  } catch (error) {
    logger.error(
      `Failed to push new WhatsApp message to user document: ${error}.`
    );
    return res.status(500).json({
      message: "Failed to push new WhatsApp message to user document.",
    });
  }

  res.sendStatus(200);
}
