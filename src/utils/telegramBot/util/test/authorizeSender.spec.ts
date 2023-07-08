import { authorizeSender } from "../authorizeSender";
import TelegramBot from "node-telegram-bot-api";
import telegramDemoUser from "../../../../testing/data/telegram/telegramDemoSender";

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

import logger from "../../../../logger";

describe("User Authorization Tests", () => {
  const demoMessage = "Listener tried to access: 'onMessageHandler'";
  let demoWhiteList: Array<TelegramBot.User["id"]> = [];

  beforeEach(() => {
    demoWhiteList = []; // Reset the whitelist
  });

  test("should fail when the user is undefined", () => {
    const userNotAuthorized = !authorizeSender(undefined, demoMessage);
    expect(userNotAuthorized).toBeTruthy();
    expect(logger.warn).toBeCalledWith(
      `No user was provided. Not allowed to access the system. ${demoMessage}`
    );
  });

  test("should flag user as unauthorized if their Telegram ID is not whitelisted", () => {
    // Add a negative value to the whitelist to make the user unauthorized
    demoWhiteList.push(telegramDemoUser.id * -1);
    const userNotAuthorized = !authorizeSender(
      telegramDemoUser,
      demoMessage,
      demoWhiteList
    );
    expect(userNotAuthorized).toBeTruthy();
    expect(logger.warn).toHaveBeenCalledWith(
      `User ${telegramDemoUser.id} is not authorized to interact with the chatbot. ${demoMessage}`
    );
  });

  test("should authorize user if their Telegram ID is whitelisted", () => {
    // Add the user's ID to the whitelist to make the user authorized
    demoWhiteList.push(telegramDemoUser.id);

    const userNotAuthorized = !authorizeSender(
      telegramDemoUser,
      demoMessage,
      demoWhiteList
    );
    expect(userNotAuthorized).toBeFalsy();
    expect(logger.info).toBeCalledWith(
      `Authorized user: ${telegramDemoUser.id}`
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
