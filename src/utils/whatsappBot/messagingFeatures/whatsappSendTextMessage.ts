import Helper from "../utils/Helper";
import { IMessagesEndpointError } from "./types/error";
import { Services } from "../types/service";
import { IMessageResponseData, ITextObject } from "./types/textMessage";
import axios from "axios";
import logger from "../../../logger";

/**
 * Sends a text message using the Meta Cloud API.
 * @param textObject The text message object to be sent.
 * @throws Error if sending the message to Meta fails.
 */
export async function telegramSendTextMessage(
  textObject: ITextObject
): Promise<void> {
  // Make a POST request to the Meta Cloud API
  const url = Helper.constructUrlPathToMetaService(Services.MESSAGES);
  logger.verbose(
    `Received the task to send a whatsapp message: ${JSON.stringify(
      textObject
    )}`
  );
  let response;
  try {
    const config = {
      url,
      method: "post",
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.USER_ACCESS_TOKEN}`,
      },
      data: textObject,
    };
    response = await axios.request(config);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error, log the specific details
      logger.error(
        `Failed to send WhatsApp text message. Axios error: ${error.message}`
      );
      logger.error(`Status: ${error.response?.status}`);
      logger.error(`Data: ${JSON.stringify(error.response?.data)}`);
    } else {
      // Other types of errors
      logger.error(`Failed to send WhatsApp text message: ${error}`);
    }
    return;
  }

  // If there is a response from the Meta Cloud API.
  if (response) {
    const responseData: IMessageResponseData | IMessagesEndpointError =
      response.data;

    // Check for error conditions in the response.

    // If the response status is not 200 (success) or the response data is empty,
    // throw an error indicating that the message failed to send to Meta.
    if (
      response.status !== 200 ||
      !response.data ||
      Object.keys(response.data).length == 0
    ) {
      logger.error("Failed to send message to Meta.");
      throw new Error("Failed to send message to Meta.");
    }

    // If the response data contains an error message, throw an error with the specific error message.
    if ("error" in response.data) {
      const errorMessage = (responseData as IMessagesEndpointError).error
        .message;
      logger.error("Failed to send message to Meta. Error: " + errorMessage);
      throw new Error("Failed to send message to Meta. Error: " + errorMessage);
    }
    logger.info(
      `Text message was successfully sent: ${JSON.stringify(textObject)}`
    );
  }
}
