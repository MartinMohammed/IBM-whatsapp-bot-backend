import { fetchBotCommands } from "../fetchBotCommands";
import Constants from "../../../Constants";
import TelegramBot from "node-telegram-bot-api";
import telegramDemoBotCommands from "../../../../testing/data/telegram/telegramDemoBotCommands";

describe("test if the fetchBotCommands method fetches the latest bot commands and stores them into constants", () => {
  it("should call the 'telegramBot.getMyCommands' method", async () => {
    const telegramBot = {
      getMyCommands: jest.fn().mockResolvedValue(telegramDemoBotCommands),
    };

    expect(Constants.BOT_COMMANDS).toEqual([]); // Initial value should be an empty array
    await fetchBotCommands(telegramBot as unknown as TelegramBot);
    expect(telegramBot.getMyCommands).toBeCalled();
    expect(Constants.BOT_COMMANDS).toEqual(telegramDemoBotCommands); // Constants.BOT_COMMANDS should be updated with telegramDemoBotCommands
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
