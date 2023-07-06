import { whatsappDemoWebhookPayload } from "../../../../../testing/data/whatsapp/whatsappDemoWebhookPayload";
import { IMessage } from "../../types/message";
import { handleMessages } from "../handleMessages";
import * as messageHandler from "../../messageHandler";
import * as SendTextMessageModule from "../../../messagingFeatures/sendTextMessage";

describe("Given a bunch of messages", () => {
  let mockMessageHandler: jest.SpyInstance<
    void,
    [
      message: IMessage,
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      }
    ],
    any
  >;

  beforeEach(() => {
    jest
      .spyOn(SendTextMessageModule, "sendTextMessage")
      .mockImplementation((_) => Promise.resolve());
    // Mock the messageHandler function
    mockMessageHandler = jest
      .spyOn(messageHandler, "messageHandler")
      .mockImplementation((_) => undefined);
  });

  it("should call messageHandler for the amount of messages: ", () => {
    const { messages, metadata } =
      whatsappDemoWebhookPayload["entry"][0].changes[0].value;
    handleMessages(messages!, metadata);
    expect(mockMessageHandler).toBeCalledTimes(messages!?.length);
  });

  afterEach(() => {
    // Resets all information stored in the mock, including any initial implementation and mock name given.
    jest.restoreAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
