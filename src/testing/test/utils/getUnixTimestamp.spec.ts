import getUnixTimestamp from "../../../utils/getUnixTimestamp";

/**
 * Test suite for the 'getUnixTimestamp' utility function.
 */
describe("Test the 'getUnixTimestamp' utility function", () => {
  /**
   * Test case: should return the correct Unix timestamps when called and when called again 5 seconds later.
   */
  it("should return the correct Unix timestamps when called and when called again 5 seconds later", async () => {
    // Set the time to wait in milliseconds
    const timeToWaitInMs = 2 * 1000;

    // Get the first Unix timestamp
    const result1 = getUnixTimestamp();

    // Wait for the specified time and get the second Unix timestamp
    const result2 = await new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        resolve(getUnixTimestamp());
      }, timeToWaitInMs);
    });

    // Calculate the expected time difference in seconds
    const expectedTimeDiffInSeconds = timeToWaitInMs / 1000;

    // Assert that the time difference between the two timestamps is as expected
    expect(result2 - result1).toBe(expectedTimeDiffInSeconds);
  });
});
