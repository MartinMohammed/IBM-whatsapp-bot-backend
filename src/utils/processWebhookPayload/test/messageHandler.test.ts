import { demoChangesPayload } from "../../../demoData/webhookPayload";
import { messageHandler, repliedToMessage } from "../messageHandler";
import { IMessage, MessageTypes } from "../types/message";
import * as MessageHandlerModule from "../messageHandler";
import * as SendTextMessageModule from "../../messagingFeatures/sendTextMessage";
import * as DevelopmentLoggerModule from "../../../logger/developmentLogger";
import winston from "winston";

describe("Given messages from Changes:", () => {
  let mockedRepliedToMessage: jest.SpyInstance<boolean, [message: IMessage]>;

  beforeAll(() => {
    // Mock the console.log function
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest
      .spyOn(SendTextMessageModule, "sendTextMessage")
      .mockImplementation((textObject) => Promise.resolve());
    // Create a mock logger object that satisfies the Logger type
    const mockLogger: unknown = {
      error: jest.fn(),
      warn: jest.fn(),
      http: jest.fn(),
      info: jest.fn(),
      // Add other methods from the Logger type if needed
    };
    jest
      .spyOn(DevelopmentLoggerModule, "developmentLogger")
      .mockReturnValue(mockLogger as winston.Logger);
  });

  beforeEach(() => {
    mockedRepliedToMessage = jest.spyOn(
      MessageHandlerModule,
      "repliedToMessage"
    );
  });

  it("should throw an error if the message type is unknown", () => {
    const unknownMessageType = "unknown_message_type";

    const { metadata, messages } = demoChangesPayload.entry[0].changes[0].value;
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
    const { messages, metadata } = demoChangesPayload.entry[0].changes[0].value;

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
    const { messages, metadata } = demoChangesPayload.entry[0].changes[0].value;
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
