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

import actionHandler from "../actionHandler";

import logger from "../../../../../../logger";
import Constants from "../../../../../Constants";

describe("Given a Telegram message", () => {
  beforeAll(() => {});

  // Push an initial bot command.
  beforeEach(() => {});
  it.todo("");

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
