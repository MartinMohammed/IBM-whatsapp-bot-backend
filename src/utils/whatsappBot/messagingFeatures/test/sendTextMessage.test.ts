import Helper from "../../utils/Helper";
import { MessageTypes } from "../../processWebhookPayload/types/message";
import { Services } from "../../types/service";
import { sendTextMessage } from "../sendTextMessage";
import { IMessagesEndpointError } from "../types/error";
import { IMessageResponseData } from "../types/textMessage";
import whatsappDemoUser from "../../../../testing/data/whatsapp/whatsappDemoUser";
import whatsappDemoTextObject from "../../../../testing/data/whatsapp/whatsappDemoTextObject";
import axios from "axios";

// Mock the logger module
jest.mock("../../../../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));

import logger from "../../../../logger";

describe("sendMessage Test", () => {
  const demoResponseData: IMessageResponseData = {
    // Mocked response data
    messaging_product: "whatsapp",
    contacts: [
      {
        input: whatsappDemoUser.to,
        wa_id: whatsappDemoUser.to,
      },
    ],
    messages: [
      {
        id: "wamid.HBgMNDkxNzk0NjYxMzasdfsdafIAERgSRThGRjgyMTJFQkZEMUM3NDU4AA==",
      },
    ],
  };
  const constDemoResponseBody = {
    data: demoResponseData,
    status: 200,
  };

  let mockAxiosRequest: jest.SpyInstance;

  beforeEach(() => {
    // Mock the axios.post method
    mockAxiosRequest = jest.spyOn(axios, "request");
  });

  it("should make a POST request to the WhatsApp Cloud API to send a message to a user", async () => {
    // Mock the axios.post method to return the demo response body
    mockAxiosRequest.mockResolvedValue(constDemoResponseBody);

    // Call the sendTextMessage function and expect it not to throw an error
    await expect(
      sendTextMessage(whatsappDemoTextObject)
    ).resolves.not.toThrowError();
    expect(logger.verbose).toBeCalledWith(
      `Received the task to send a whatsapp message: ${JSON.stringify(
        whatsappDemoTextObject
      )}`
    );

    // Expect the axios.post method to have been called with the correct arguments
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      url: Helper.constructUrlPathToMetaService(Services.MESSAGES),
      method: "post",
      maxBodyLength: Infinity,
      data: whatsappDemoTextObject,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.USER_ACCESS_TOKEN}`,
      },
    });
    expect(logger.info).toBeCalledWith(
      `Text message was successfully sent: ${JSON.stringify(
        whatsappDemoTextObject
      )}`
    );
  });

  it("should throw an axios error if the network connection failed when making a post request", async () => {
    const demoAxiosErrorMessage = "Failed to make a HTTP request.";
    mockAxiosRequest.mockRejectedValueOnce(
      new axios.AxiosError(demoAxiosErrorMessage)
    );
    await expect(
      sendTextMessage(whatsappDemoTextObject)
    ).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith(
      `Failed to send WhatsApp text message. Axios error: ${demoAxiosErrorMessage}`
    );
  });

  it("should throw an error because the status code returned was not 200", async () => {
    // Mock the axios.post method to return a response with status 404
    mockAxiosRequest.mockResolvedValue({ status: 404, data: demoResponseData });

    // Expect sendTextMessage to throw an error when called
    await expect(sendTextMessage(whatsappDemoTextObject)).rejects.toThrowError(
      "Failed to send message to Meta."
    );
    expect(logger.error).toHaveBeenCalledWith(
      "Failed to send message to Meta."
    );
  });

  it("should throw an error if the status code is 200 but no response body was sent or when it is empty", async () => {
    // Mock the axios.post method to return a response with status 200 and no data
    mockAxiosRequest.mockResolvedValue({ status: 200 });

    // Expect sendTextMessage to throw an error when called
    await expect(sendTextMessage(whatsappDemoTextObject)).rejects.toThrowError(
      "Failed to send message to Meta."
    );
    expect(logger.error).toBeCalledWith("Failed to send message to Meta.");
  });

  it("should throw an error containing the error message when the 'error' property was set in response data", async () => {
    const messageEndpointError: IMessagesEndpointError = {
      error: {
        code: 238,
        type: "OAuthException",
        message: "(#131030) Recipient phone number not in allowed list",
        error_data: {
          messaging_product: "whatsapp",
          details:
            "Recipient phone number not in allowed list: Add recipient phone number to the recipient list and try again.",
        },
        fbtrace_id: "A7AFUulwUEMY3wOGvyJwzg-",
      },
    };

    mockAxiosRequest.mockResolvedValue({
      status: 200,
      data: messageEndpointError,
    });

    // Expect sendTextMessage to throw an error containing the error message
    const errorMessage = `Failed to send message to Meta. Error: ${messageEndpointError.error.message}`;
    await expect(sendTextMessage(whatsappDemoTextObject)).rejects.toThrowError(
      new Error(errorMessage)
    );
    expect(logger.error).toBeCalledWith(errorMessage);
  });

  afterEach(() => {
    // Clears the mock.calls and mock.instances properties of all mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore all mocks
    jest.restoreAllMocks();
  });
});
