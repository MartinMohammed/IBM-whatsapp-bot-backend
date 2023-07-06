import TelegramBot from "node-telegram-bot-api";
import telegramDemoBotCommands from "../../../../../testing/data/telegram/telegramDemoBotCommands";
import { checkIfMessageIsBotCommand } from "../checkIfMessageIsBotCommand";
import Constants from "../../../../Constants";
import { telegramDemoMessageLean } from "../../../../../testing/data/telegram/telegramDemoMessages";

describe("Given is a message, check if it is a bot command:", () => {
  // Prepare a bot command message with "/hi" as the command
  const botCommand: TelegramBot.Message = {
    ...telegramDemoMessageLean,
    text: "/hi",
    entities: [
      {
        offset: 0,
        length: 2,
        type: "bot_command",
      },
    ],
  };

  it("should return -1 indicating the command is not a bot command:", () => {
    // Assert that the result of the function is -1 since "/hi" is not in the bot commands list
    expect(checkIfMessageIsBotCommand(botCommand)).toBe(-1);
  });

  it("should return 0 because the bot command is already in the list:", () => {
    // Assert that the length of Constants.BOT_COMMANDS is 0 initially
    expect(Constants.BOT_COMMANDS.length).toBe(0);

    // Modify the text of the bot command to "/help"
    botCommand.text = "/help";

    // Add a bot command to Constants.BOT_COMMANDS
    Constants.BOT_COMMANDS.push(telegramDemoBotCommands[0]);

    // Assert that the result of the function is 0 since "/help" is in the bot commands list at index 0
    expect(checkIfMessageIsBotCommand(botCommand)).toBe(0);

    // Reset Constants.BOT_COMMANDS to an empty array for subsequent tests
    Constants.BOT_COMMANDS = [];
  });
});
