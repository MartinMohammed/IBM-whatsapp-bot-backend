import { demoChangesPayload } from "../../../../demoData/webhookPayload";
import { IMessage, MessageType, MessageTypes } from "../../types/message";
import { handleMessages } from "../handleMessages";
import * as messageHandler from "../../messageHandler";

describe("Given a bunch of messages", () => {
  let mockMessageHandler: jest.SpyInstance<
    void,
    [
      message: IMessage,
      metadata: {
        readonly display_phone_number: string;
        readonly phone_number_id: string;
      }
    ],
    any
  >;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    // Mock the messageHandler function
    mockMessageHandler = jest
      .spyOn(messageHandler, "messageHandler")
      .mockImplementation((message) => undefined);
  });

  it("should call messageHandler for the amount of messages: ", () => {
    const { messages, metadata } =
      demoChangesPayload["entry"][0].changes[0].value;
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
