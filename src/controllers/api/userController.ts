import express from "express";
import User from "../../models/mongoDB/schemas/User";
import logger from "../../logger";
import Constants from "../../utils/Constants";
import getWhatsappBot from "../../utils/whatsappBot/init";
import { WhatsappMessageStoredType } from "../../customTypes/models/WhatsappMessagesStored";
import getUnixTimestamp from "../../utils/getUnixTimestamp";
import { getUser } from "../../models/mongoDB/UserRepository";
import { IUser } from "../../customTypes/models/User";
import { UsersFilterList } from "../../app";
import createHttpError from "http-errors";
import messageSchema from "../../utils/validation/messageSchema";
import HTTPError from "../../customTypes/REST/HTTPError";

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
  const defaultFilterList: UsersFilterList = [
    "wa_id",
    "whatsapp_messages",
    "name",
  ];

  // For narrowing the information the clients want,
  // we add a query parameter called 'fields' which has comma seperated list.
  // e.g. http://localhost:3000/api/users?fields=name,wa_id
  const receivedFilterString: string = req.query.fields as string;
  let receivedFilterList = receivedFilterString?.split(",") as
    | UsersFilterList
    | undefined;

  /** This filter contains all filters exclusive of invalid filters */
  let actualFilterList: UsersFilterList = [];

  if (receivedFilterList === undefined) {
    logger.verbose(`No field filters for the '/users' endpoint were provided.`);
    actualFilterList = defaultFilterList;
  } else {
    logger.verbose(
      `Field filters for the '/users' endpoint were provided: ${receivedFilterString}.`
    );
    // Check for invalid filterItems.
    receivedFilterList.forEach((filterItem) => {
      // Check if that filterItem is valid:
      const validFilters: UsersFilterList = [
        "name",
        "wa_id",
        "whatsapp_messages",
        "whatsappProfileImage",
      ];
      if (!validFilters.includes(filterItem as keyof IUser)) {
        // Item is not valid;
        logger.error(
          `An invalid filterItem was added when making a request to '/api/users': '${`invalid_field`}'.`
        );
      } else actualFilterList.push(filterItem);
    });
  }

  // This part must be tested.
  try {
    const userRefs = await User.find({}).select(actualFilterList).lean();
    logger.info("Successfully retrieved all users from the database.");
    res.status(200).json(userRefs);
  } catch (error) {
    logger.error("Failed to retrieve users from the database.", error);
    next(
      createHttpError.InternalServerError(
        "Failed to retrieve users from the database."
      )
    );
  }
}

export async function getMessagesOfUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const wa_id = req.params.userId;

  /**
   * Determines the limit for pagination
   * Each page is 10 items
   * */

  const pageQP: string = req.query.page as string;
  const limit = Number.isInteger(parseInt(pageQP))
    ? parseInt(pageQP) * 10
    : undefined;
  const userRef = await getUser(wa_id, ["whatsapp_messages"], limit);
  if (!userRef) {
    logger.error(
      `Document of user with wa_id ${wa_id} not found in the database.`
    );
    return res
      .status(500)
      .json({ message: "Document not found in the database." });
  }
  logger.verbose(
    `Document with wa_id ${wa_id} was fetched for receiving his whatsapp_messages.`
  );
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
  const body = req.body;
  body.wa_id = wa_id;

  let sanitizedBody = null;
  try {
    // Validate and sanitize the input.
    sanitizedBody = await messageSchema.validateAsync(body);
  } catch (error) {
    // Create a custom error object and set the statusCode property
    const validationError: HTTPError = {
      message: (error as { message: string }).message,
      statusCode: 422,
    };
    return next(validationError);
  }

  let userRef = await getUser(wa_id);
  if (!userRef) {
    const errorMessage = `Document of user with wa_id ${wa_id} not found in the database.`;
    logger.error(errorMessage);
    return next(createHttpError.BadRequest(errorMessage));
  }

  const recipient = userRef.whatsapp_messages[0].wa_id;
  const wam_id = await whatsappBot.sendTextMessage(
    sanitizedBody.text,
    recipient
  );

  if (!wam_id || !Constants.phoneNumber) {
    logger.warn(
      "WhatsApp Bot has not provided a wam_id for the message it sent."
    );
    return next(
      createHttpError.InternalServerError("Failed to send WhatsApp message.")
    );
  }

  const newWhatsappMessage: WhatsappMessageStoredType = {
    text: sanitizedBody.text,
    wa_id: Constants.phoneNumber,
    wam_id,
    sentByClient: true,
    timestamp: getUnixTimestamp(),
  };

  userRef.whatsapp_messages.push(newWhatsappMessage);

  try {
    await userRef.save();
    logger.info(
      "Successfully appended new WhatsApp message to the user's array."
    );
  } catch (error) {
    logger.error(
      `Failed to push new WhatsApp message to user document: ${error}.`
    );
    return next(
      createHttpError.InternalServerError(
        "Failed to push new WhatsApp message to user document."
      )
    );
  }

  res.sendStatus(200);
}
