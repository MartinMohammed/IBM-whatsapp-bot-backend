import { demoChangesPayload } from "../../../demoData/webhookPayload";
import { messageHandler } from "../messageHandler";
import { IMessage, MessageTypes } from "../types/message";

describe("Given messages from Changes:", () => {
  beforeAll(() => {
    // Mock the console.log function
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should throw an error if the message type is unknown", () => {
    const unkownMessageType = "unknown_message_type";

    const { metadata, messages } = demoChangesPayload.entry[0].changes[0].value;
    const demoMessage = {
      ...messages![0],
      type: unkownMessageType as MessageTypes,
    } as IMessage;

    expect(() => {
      messageHandler(demoMessage, metadata);
    }).toThrow(Error("Unknown Message Type: " + unkownMessageType));
  });

  it("should not throw an error if the message type is known", () => {
    const { messages, metadata } = demoChangesPayload.entry[0].changes[0].value;
    Object.values(MessageTypes).forEach((validMessageType) => {
      const demoMessage = {
        ...messages![0],
        type: validMessageType,
      } as IMessage;
      expect(() => messageHandler(demoMessage, metadata)).not.toThrow(
        Error("Unknown Message Type: " + validMessageType)
      );
    });
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
