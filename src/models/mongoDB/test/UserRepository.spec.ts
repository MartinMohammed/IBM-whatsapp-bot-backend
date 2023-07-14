import logger from "../../../logger";
import demoUserStored from "../../../testing/data/whatsapp/Mongo/userStored";
import { getUser } from "../UserRepository";
import mockedUser from "../schemas/User";

jest.mock("../schemas/User", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

/**
 * Testing the user repository, which includes functions that interact with the users database.
 */
describe("Testing the user repository", () => {
  /**
   * Test the function that tries to find a specific user with the given wa_id.
   */
  it("should try to find a specific user with the given wa_id", async () => {
    // Mock the return value of User.findOne() to resolve to a mocked user
    (mockedUser.findOne as jest.Mock).mockResolvedValueOnce(demoUserStored);

    const user = await getUser(demoUserStored.wa_id);

    expect(logger.verbose).toBeCalledWith(
      `Find one User with the given wa_id ${demoUserStored.wa_id} completed. Document is null: false`
    );
    expect(user).toBe(demoUserStored);
  });

  /**
   * Test the function that handles errors when finding a user.
   */
  it("should handle errors when finding a user", async () => {
    const demoError = new Error("EFATAL"); // network error
    (mockedUser.findOne as jest.Mock).mockRejectedValueOnce(demoError);

    const userRef = await getUser(demoUserStored.wa_id);

    expect(logger.error).toBeCalledWith(
      `Could not fetch user document with wa_id '${demoUserStored.wa_id}' from database. ${demoError}`
    );
    expect(userRef).toBe(null);
  });
});
