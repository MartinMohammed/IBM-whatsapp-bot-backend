import { validateReceivedMessage } from "../validateReceivedMessage";
import { telegramDemoMessageLean } from "../../../../../testing/data/telegram/telegramDemoMessages";
import TelegramBot = require("node-telegram-bot-api");
// Mock the logger module
jest.mock("../../../../../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));
import logger from "../../../../../logger";

describe("test the validateReceivedMessage method: ", () => {
  /**
   * Test the validateReceivedMessage method.
   */
  it("should return false if no message was provided", () => {
    // Call the validateReceivedMessage function with an undefined message
    const messageIsInvalid = !validateReceivedMessage(
      undefined as unknown as TelegramBot.Message
    );

    // Expect that the message is considered invalid
    expect(messageIsInvalid).toBeTruthy();

    // Expect that logger.warn is called with the expected warning message
    expect(logger.warn).toHaveBeenCalledWith("Received an undefined message.");
  });

  /**
   * Test the validateReceivedMessage method.
   */
  it("should return true if the message provided was valid", () => {
    // Call the validateReceivedMessage function with the demo message
    const messageIsValid = validateReceivedMessage(telegramDemoMessageLean);

    // Expect that the message is considered valid
    expect(messageIsValid).toBeTruthy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
