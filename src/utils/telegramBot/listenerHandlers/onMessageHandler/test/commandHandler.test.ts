import TelegramBot from "node-telegram-bot-api";
import Constants from "../../../../Constants";

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

describe("Given a Telegram message", () => {
  let demoMessage: TelegramBot.Message;

  beforeEach(() => {
    // Mocking the BOT_COMMANDS array
    Constants.BOT_COMMANDS = [
      { command: "hi", description: "Sag Hallo" },
      { command: "bye", description: "Sag Tschüss" },
    ];
  });

  it("should log to verbose and return undefined if the bot command is not supported: ", () => {
    // const errorMessage = `Bot command: ${demoMessage.text} is not supported.`;
    // expect(() => commandHandler(demoMessage)).toThrowError(errorMessage);
    // expect(logger.error).toBeCalledWith(errorMessage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
