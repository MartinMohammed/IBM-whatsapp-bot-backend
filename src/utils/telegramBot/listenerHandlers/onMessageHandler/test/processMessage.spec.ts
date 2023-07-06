import { processMessage } from "../processMessage";
import { telegramDemoMessageLean } from "../../../../../testing/data/telegram/telegramDemoMessages";
import * as CommandHandlerModule from "../textMessageHandler/commandHandler";

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
import Constants from "../../../../Constants";
import telegramDemoBotCommands from "../../../../../testing/data/telegram/telegramDemoBotCommands";

describe("test the processMessage method: ", () => {
  describe("start and end of the function: ", () => {
    /**
     * Test the processMessage method.
     * It should log if it returned a valid message.
     */
    it("should log if it returned a valid message", () => {
      // Call the processMessage function
      processMessage(telegramDemoMessageLean);

      // Expect that logger.debug is called with the expected message
      expect(logger.debug).toBeCalledWith(
        `Received a message ${JSON.stringify(telegramDemoMessageLean)}`
      );
    });

    /**
     * Test that processMessage returns void and logs a warning
     * if the message type is not handled.
     */
    it("should return void and log a warning if the message type is not handled", () => {
      const demoMessageLean = telegramDemoMessageLean;
      // e.g. does not have a text 'property' thus, we expect that commandHandler will not get called.
      processMessage(demoMessageLean);
      expect(logger.warn).toBeCalledWith(
        `Unhandled message ${JSON.stringify(
          demoMessageLean
        )}. It's type was not handled.`
      );
    });

    // Mock the commandHandler
    jest.spyOn(CommandHandlerModule, "commandHandler");
    expect(CommandHandlerModule.commandHandler).not.toBeCalled();
  });
  describe("test 'checkIfMessageIsBotCommand': ", () => {
    beforeAll(() => {
      expect(Constants.BOT_COMMANDS).toEqual([]); // Verify the initial value
    });

    beforeEach(() => {
      // Push an initial bot command.
      const [demoCommand1] = telegramDemoBotCommands;
      Constants.BOT_COMMANDS.push({ ...demoCommand1, command: "help" });
    });

    /**
     * Test that processMessage returns undefined and logs a warning
     * if the message was a bot command but an invalid one.
     */
    it("should return undefined and log if the message was an invalid bot command", () => {
      const botCommand: TelegramBot.Message = {
        ...telegramDemoBotCommandMessage,
      };
      processMessage(botCommand);
      expect(logger.verbose).not.toBeCalledWith(
        `${botCommand.text} is a bot command.`
      );
      expect(logger.warn).toBeCalledWith(
        `Unhandled text message, no matching signature for: ${botCommand.text}.`
      );
    });

    /**
     * Test that processMessage logs the bot command if it is supported.
     */
    it("should log the bot command if it is a supported bot command", () => {
      Constants.BOT_COMMANDS = telegramDemoBotCommands;

      const botCommand: TelegramBot.Message = telegramDemoBotCommandMessage;
      botCommand.text = telegramDemoBotCommandMessage.text;
      processMessage(botCommand);
      expect(logger.verbose).not.toBeCalledWith(
        `${telegramDemoBotCommandMessage.text} is not a bot command.`
      );
      expect(logger.verbose).toBeCalledWith(
        `${telegramDemoBotCommandMessage.text} is a bot command.`
      );
    });
  });
  describe("test 'checkIfMessageIsWhatsappAction': ", () => {
    it.todo(
      "should call the telegram action handler if the message is whatsapp action: "
    );
  });

  afterEach(() => {
    Constants.BOT_COMMANDS = [];
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    // Verify that Constants.BOT_COMMANDS was properly reset
    expect(Constants.BOT_COMMANDS).toEqual([]);
  });
});
