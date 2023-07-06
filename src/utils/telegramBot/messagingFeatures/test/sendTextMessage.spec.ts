import { sendTextMessage } from "../sendTextMessage";
import TelegramBot from "node-telegram-bot-api";

// Mock the logger module
jest.mock("../../../../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));

jest.mock("../..", () => ({
  sendMessage: jest
    .fn()
    .mockImplementationOnce(
      (
        chatId: TelegramBot.ChatId,
        text: string,
        options?: TelegramBot.SendMessageOptions
      ) => Promise.resolve()
    )
    .mockImplementationOnce(
      (
        chatId: TelegramBot.ChatId,
        text: string,
        options?: TelegramBot.SendMessageOptions
      ) => Promise.reject(new Error("EFATAL")) // Network error
    ),
}));

import logger from "../../../../logger";
import telegramBot from "../..";

describe("Test the sendMessage feature of the telegram bot", () => {
  const demoChatId = 12345;
  const demoText = "abcdef";
  const demoSendMessageOptions = undefined;

  it("should send the message successfully if there is no error while sending the message", async () => {
    await expect(
      sendTextMessage(demoChatId, demoText, demoSendMessageOptions)
    ).resolves.toBeUndefined();

    // Expect that sendMessage is called with the correct arguments
    expect(telegramBot?.sendMessage).toHaveBeenCalledWith(
      demoChatId,
      demoText,
      demoSendMessageOptions
    );

    // Expect that logger.info is called with the correct message
    expect(logger.info).toHaveBeenCalledWith(
      `Message to chatId ${demoChatId} was sent successfully.`
    );
  });

  it("should log an error if sending a message failed", async () => {
    await sendTextMessage(demoChatId, demoText, demoSendMessageOptions);

    // Expect that logger.error is called with the correct message
    expect(logger.error).toHaveBeenCalledWith(
      `Sending message to chatId ${demoChatId} failed.`
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
