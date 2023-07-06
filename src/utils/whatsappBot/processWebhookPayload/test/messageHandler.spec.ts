import { whatsappDemoWebhookPayload } from "../../../../testing/data/whatsapp/whatsappDemoWebhookPayload";
import { messageHandler } from "../messageHandler";
import { IMessage, MessageTypes } from "../types/message";
import * as MessageHandlerModule from "../messageHandler";
import * as SendTextMessageModule from "../../messagingFeatures/sendTextMessage";

describe("Given messages from Changes:", () => {
  let mockedRepliedToMessage: jest.SpyInstance<boolean, [message: IMessage]>;

  beforeAll(() => {
    jest
      .spyOn(SendTextMessageModule, "sendTextMessage")
      .mockImplementation((textObject) => Promise.resolve());
  });

  beforeEach(() => {
    mockedRepliedToMessage = jest.spyOn(
      MessageHandlerModule,
      "repliedToMessage"
    );
  });

  it("should throw an error if the message type is unknown", () => {
    const unknownMessageType = "unknown_message_type";

    const { metadata, messages } =
      whatsappDemoWebhookPayload.entry[0].changes[0].value;
    const demoMessage = {
      ...messages![0],
      type: unknownMessageType as MessageTypes,
    } as IMessage;

    expect(() => {
      messageHandler(demoMessage, metadata);
      expect(mockedRepliedToMessage).toReturnWith(false);
    }).toThrow(Error("Unknown Message Type: " + unknownMessageType));
  });

  it("should not throw an error if the message type is known", () => {
    const { messages, metadata } =
      whatsappDemoWebhookPayload.entry[0].changes[0].value;

    Object.values(MessageTypes).forEach((validMessageType) => {
      const demoMessage = {
        ...messages![0],
        type: validMessageType,
      } as IMessage;
      expect(() => {
        messageHandler(demoMessage, metadata);
        expect(mockedRepliedToMessage).toReturnWith(false);
      }).not.toThrow(Error("Unknown Message Type: " + validMessageType));
    });
  });

  test("that 'repliedToMessage' function returns true if the message is indeed a reply message", () => {
    const { messages, metadata } =
      whatsappDemoWebhookPayload.entry[0].changes[0].value;
    const demoMessage: IMessage = {
      ...messages![0],
      context: {
        from: "abc",
        message_id: "defg",
      },
    };
    expect(() => {
      messageHandler(demoMessage, metadata);
      expect(mockedRepliedToMessage).toReturnWith(true);
    }).not.toThrow(Error("Unknown Message Type: " + MessageTypes.TEXT));
  });

  afterEach(() => {
    mockedRepliedToMessage.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
