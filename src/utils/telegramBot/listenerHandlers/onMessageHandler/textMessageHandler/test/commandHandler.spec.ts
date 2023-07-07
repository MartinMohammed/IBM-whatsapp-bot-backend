import _ from "lodash";
import commandHandler from "../commandHandler";
import {
  BotCommandsWithTemplate,
  BotCommandWithTemplateType,
} from "../types/supportedBotCommands";

// Mock the logger module
jest.mock("../../../../../../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));

import * as TelegramSendTextMessageModule from "../../../../messagingFeatures/telegramSendTextMessage";
jest
  .spyOn(TelegramSendTextMessageModule, "sendTextMessage")
  .mockImplementation((chatId, text, options) => Promise.resolve());

import logger from "../../../../../../logger";
import telegramDemoBotCommands from "../../../../../../testing/data/telegram/telegramDemoBotCommands";
import { telegramDemoBotCommandMessage } from "../../../../../../testing/data/telegram/telegramDemoMessages";
import Constants from "../../../../../Constants";

describe("Given a Telegram message", () => {
  beforeAll(() => {
    expect(Constants.BOT_COMMANDS).toEqual([]); // Verify the initial value
  });

  // Push an initial bot command.
  beforeEach(() => {
    const [demoCommand1] = telegramDemoBotCommands;
    Constants.BOT_COMMANDS.push({ ...demoCommand1, command: "help" });
  });

  it("should log the reception of all supported bot commands and send a messageTemplate back", () => {
    // Test each supported bot command
    Object.values(BotCommandsWithTemplate).forEach(
      (supportedBotCommand, index) => {
        commandHandler(
          { ...telegramDemoBotCommandMessage, text: `/${supportedBotCommand}` },
          index
        );
        expect(logger.verbose).toBeCalledWith(
          `Received bot command: /${supportedBotCommand}`
        );

        // For every supported command, there should be a message template.
        expect(TelegramSendTextMessageModule.sendTextMessage).toBeCalledWith(
          telegramDemoBotCommandMessage.chat.id,

          Constants.BOT_COMMAND_MESSAGE_TEMPLATES[supportedBotCommand]
        );
      }
    );
  });

  it("should return void and log an error when there is no commandMessageTemplate for a specific command", () => {
    // Get the first supportedBotCommand
    const supportedBotCommand = Object.values(BotCommandsWithTemplate)[0];

    if (supportedBotCommand) {
      const botCommandMessageTemplate =
        Constants.BOT_COMMAND_MESSAGE_TEMPLATES[supportedBotCommand];
      // Remove the messageTemplate for that specific bot command:
      Constants.BOT_COMMAND_MESSAGE_TEMPLATES = _.omit(
        Constants.BOT_COMMAND_MESSAGE_TEMPLATES,
        supportedBotCommand
      ) as BotCommandWithTemplateType;

      commandHandler(
        { ...telegramDemoBotCommandMessage, text: `/${supportedBotCommand}` },
        0
      );

      expect(logger.error).toBeCalledWith(
        `Unable to retrieve a commandMessageTemplate for botCommand: ${supportedBotCommand}.`
      );

      // Reset back
      Constants.BOT_COMMAND_MESSAGE_TEMPLATES[supportedBotCommand] =
        botCommandMessageTemplate;
    }
    expect(TelegramSendTextMessageModule.sendTextMessage).not.toBeCalled();
  });

  it("should log an error if the provided message is not a bot command", () => {
    const invalidBotCommandIndex = Constants.BOT_COMMANDS.length;
    const demoBotCommandMessage = {
      ...telegramDemoBotCommandMessage,
      text: "/not_supported_command",
    };

    commandHandler(demoBotCommandMessage, invalidBotCommandIndex);
    expect(logger.error).toBeCalledWith(
      `Unhandled bot command at index ${invalidBotCommandIndex} in the bot command list.`
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    Constants.BOT_COMMANDS = []; // Reset Constants.BOT_COMMANDS
  });

  afterAll(() => {
    jest.restoreAllMocks();

    // Verify that Constants.BOT_COMMANDS was properly reset
    expect(Constants.BOT_COMMANDS).toEqual([]);
  });
});
