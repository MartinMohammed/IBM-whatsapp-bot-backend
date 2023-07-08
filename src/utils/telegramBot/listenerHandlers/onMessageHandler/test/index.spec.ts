import onMessageHandler from "..";
import * as ProcessMessageModule from "../processMessage";
import * as AuthorizeSenderModule from "../../../util/authorizeSender";
import TelegramBot from "node-telegram-bot-api";
import Constants from "../../../../Constants";
import { telegramDemoMessageLean } from "../../../../../testing/data/telegram/telegramDemoMessages";

describe("Given is a demo Message sent to the onMessage telegram listener:", () => {
  beforeAll(() => {
    expect(Constants.MESSAGE_WHITE_LIST).toEqual([]); // Verify the initial value
  });

  /**
   * Test the onMessageHandler handler and the interaction of the previously tested methods.
   */
  it("should process the message after the user authorization succeeds and the message validation passes", () => {
    // Mock the whitelist temporarily

    Constants.MESSAGE_WHITE_LIST = [telegramDemoMessageLean.from!.id];

    // Mock the processMessage function
    const mockProcessMessage = jest
      .spyOn(ProcessMessageModule, "processMessage")
      .mockImplementation(() => {});

    // Call the onMessageHandler function
    onMessageHandler(telegramDemoMessageLean);

    // Expect that processMessage is called with the telegramDemoMessage
    expect(mockProcessMessage).toBeCalledWith(telegramDemoMessageLean);

    // Reset the MessageWhiteList back to its original
  });

  /**
   * Test that the sender authorization is not continued when the message validation fails.
   */
  it("should not continue authorizing the sender when the message validation failed", () => {
    const mockAuthorizeSender = jest.spyOn(
      AuthorizeSenderModule,
      "authorizeSender"
    );

    // Call onMessageHandler with an undefined message
    onMessageHandler(undefined as unknown as TelegramBot.Message);

    // Expect that authorizeSender is not called
    expect(mockAuthorizeSender).not.toBeCalled();
  });

  it("should not process the message when the authorization failed: ", () => {
    // Mock the processMessage function
    const mockProcessMessage = jest
      .spyOn(ProcessMessageModule, "processMessage")
      .mockImplementation(() => {});

    onMessageHandler(telegramDemoMessageLean);
    expect(mockProcessMessage).not.toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    Constants.MESSAGE_WHITE_LIST = []; // Reset Constants.BOT_COMMANDS
  });

  afterAll(() => {
    jest.restoreAllMocks();
    expect(Constants.MESSAGE_WHITE_LIST).toEqual([]);
  });
});
