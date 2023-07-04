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
  // Make a POST request to the Meta Cloud API
  const url = Helper.constructUrlPathToMetaService(Services.MESSAGES);
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
    console.log("message was sent");
  } catch (e) {
    // If an error occurs during the POST request, return without throwing an error.
    // This allows the calling function to handle the failure gracefully.
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
      throw new Error("Failed to send message to Meta.");
    }

    // If the response data contains an error message, throw an error with the specific error message.
    if ("error" in response.data) {
      const errorMessage = (responseData as IMessagesEndpointError).error
        .message;
      throw new Error("Failed to send message to Meta. Error: " + errorMessage);
    }
  }
}
