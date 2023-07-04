/**
 * Contains utilities for working with the Meta Cloud API and performing interactions, such as sending messages to users.
 */
import Helper from "../Helper";
import { IMessagesEndpointError } from "./types/error";
import { Services } from "../types/service";
import { IMessageResponseData, ITextObject } from "./types/textMessage";
import axios from "axios";

/**
 * Sends a text message using the Meta Cloud API.
 * @param textObject The text message object to be sent.
 * @throws Error if sending the message to Meta fails.
 */
export async function sendTextMessage(textObject: ITextObject): Promise<void> {
  // Make a POST request
  const url = Helper.constructUrlPathToMetaService(Services.MESSAGES);
  let response;
  try {
    response = await axios.post(url, textObject);
  } catch (e) {
    return;
  }
  // If there is a response.
  if (response) {
    const responseData: IMessageResponseData | IMessagesEndpointError =
      response.data;

    // Error status code or no response was sent.
    if (
      response.status !== 200 ||
      !response.data ||
      Object.keys(response.data).length == 0
    ) {
      throw new Error("Failed to send message to Meta.");
    }
    if ("error" in response.data) {
      const errorMessage = (responseData as IMessagesEndpointError).error
        .message;
      throw new Error("Failed to send message to Meta. Error: " + errorMessage);
    }
  }
}
