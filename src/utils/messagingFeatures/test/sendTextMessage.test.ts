import { MessageTypes } from "../../processWebhookPayload/types/message";
import { sendTextMessage } from "../sendTextMessage";
import { IMessagesEndpointError } from "../types/error";
import { IMessageResponseData, ITextObject } from "../types/textMessage";
import axios from "axios";

describe("sendMessage Test", () => {
  const demoUser = {
    to: "+49 123456789",
  };
  const demoResponseData: IMessageResponseData = {
    // Mocked response data
    messaging_product: "whatsapp",
    contacts: [
      {
        input: demoUser.to,
        wa_id: demoUser.to,
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
  const demoTextObject: ITextObject = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: demoUser.to,
    type: MessageTypes.TEXT,
    text: {
      preview_url: false,
      body: "Hi",
    },
  };
  let mockAxiosPost: jest.SpyInstance;
  beforeAll(() => {
    // Mock console.log
    jest.spyOn(console, "log").mockImplementation(() => {});
    // Your test code here
  });
  beforeEach(() => {
    // Mock the axios.post method
    mockAxiosPost = jest.spyOn(axios, "post");
  });
  it("should make a post request to the WhatsApp Cloud API to send a message to a user", async () => {
    // Mock the axios.post method to return the demo response body
    mockAxiosPost.mockResolvedValue(constDemoResponseBody);
    // Call the sendTextMessage function and expect it not to throw an error
    await expect(sendTextMessage(demoTextObject)).resolves.not.toThrowError();
    // Expect the axios.post method to have been called with the correct arguments
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.any(String),
      demoTextObject
    );
  });
  it("should throw an error because the status code returned was not 200", async () => {
    // Mock the axios.post method to return a response with status 404
    mockAxiosPost.mockResolvedValue({ status: 404, data: demoResponseData });
    // Expect sendTextMessage to throw an error when called
    await expect(sendTextMessage(demoTextObject)).rejects.toThrowError(
      "Failed to send message to Meta."
    );
  });
  it("should throw an error if status code is 200 but no response body was sent or when it is empty", async () => {
    // Mock the axios.post method to return a response with status 200 and no data
    mockAxiosPost.mockResolvedValue({ status: 200 });
    // Expect sendTextMessage to throw an error when called
    await expect(sendTextMessage(demoTextObject)).rejects.toThrowError(
      "Failed to send message to Meta."
    );
    // Mock the axios.post method to return a response with status 200 and empty data
    mockAxiosPost.mockResolvedValue({ status: 200, data: {} });
    // Expect sendTextMessage to throw an error when called
    await expect(sendTextMessage(demoTextObject)).rejects.toThrowError(
      "Failed to send message to Meta."
    );
  });
  it("should throw an error containing the error message when 'error' property was set in response data", async () => {
    const messageEndpointError: IMessagesEndpointError = {
      error: {
        code: 238,
        type: "OAuthException",
        message: "(#131030) Recipient phone number not in allowed list",
        error_data: {
          messaging_product: "whatsapp",
          details:
            "Recipient phone number not in allowed list: Add recipient phone number to recipient list and try again.",
        },
        fbtrace_id: "A7AFUulwUEMY3wOGvyJwzg-",
      },
    };
    mockAxiosPost.mockResolvedValue({
      status: 200,
      data: messageEndpointError,
    });
    // Expect sendTextMessage to throw an error containing the error message
    // Await Promise to reject and throw an error.
    await expect(sendTextMessage(demoTextObject)).rejects.toThrowError(
      new Error(
        "Failed to send message to Meta. Error: " +
          messageEndpointError.error.message
      )
    );
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
