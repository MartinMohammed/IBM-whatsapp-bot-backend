import telegramBot from "../init";
/**
 * Test suite to verify the instantiation and setup of the Telegram bot.
 */
describe("Telegram Bot Instantiation and Setup", () => {
  /**
   * Test case to check that the Telegram bot is not instantiated when the environment is set to 'test'.
   */
  it("should not instantiate the Telegram bot in the 'test' environment", () => {
    // Verify that the environment is set to 'test'
    expect(process.env.NODE_ENV).toBe("test");

    // Verify that the Telegram bot is undefined
    expect(telegramBot).toBeUndefined();
  });
});
