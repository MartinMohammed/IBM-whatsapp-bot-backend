import { processMessage } from "../processMessage";
import { telegramDemoMessageLean } from "../../../../../testing/data/telegram/telegramDemoMessages";

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
import TelegramBot from "node-telegram-bot-api";
import { telegramDemoBotCommandMessage } from "../../../../../testing/data/telegram/telegramDemoMessages";

describe("test the processMessage method: ", () => {
  /**
   * Test the processMessage method.
   */
  it("should log if it returned a valid message", () => {
    // Call the processMessage function
    processMessage(telegramDemoMessageLean);

    // Expect that logger.debug is called with the expected message
    expect(logger.debug).toBeCalledWith(
      `Received a message ${JSON.stringify(telegramDemoMessageLean)}`
    );
  });
  it("should return undefined and log if the message was a bot command but a invalid one: ", () => {
    const botCommand: TelegramBot.Message = telegramDemoBotCommandMessage;
    expect(processMessage(botCommand));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
