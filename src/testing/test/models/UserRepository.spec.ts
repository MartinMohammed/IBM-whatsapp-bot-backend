jest.mock("../../../models/mongoDB/schemas/User", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

import logger from "../../../logger";
import { UsersFilterList } from "../../../app";
import { getUser } from "../../../models/mongoDB/UserRepository";
import mockedUser from "../../../models/mongoDB/schemas/User";
import demoUserStored from "../../data/whatsapp/Mongo/userStored";

describe("User Repository", () => {
  /**
   * Test the function that tries to find a specific user with the given wa_id.
   */
  describe("Find User", () => {
    it("should find a specific user with the given wa_id", async () => {
      // Mock the return value of User.findOne() to resolve to a mocked user
      (mockedUser.findOne as jest.Mock).mockResolvedValueOnce(demoUserStored);

      const user = await getUser(demoUserStored.wa_id);

      expect(logger.verbose).toBeCalledWith(
        `Find one User with the given wa_id ${demoUserStored.wa_id} completed. Document is null: false`
      );
      expect(user).toBe(demoUserStored);
    });

    it("should handle errors when finding a user", async () => {
      const demoError = new Error("EFATAL"); // network error
      (mockedUser.findOne as jest.Mock).mockRejectedValueOnce(demoError);

      const userRef = await getUser(demoUserStored.wa_id);

      expect(logger.error).toBeCalledWith(
        `Could not fetch user document with wa_id '${demoUserStored.wa_id}' from the database. ${demoError}`
      );
      expect(userRef).toBe(null);
    });
  });

  /**
   * Test the function that tries to find a specific user with the given wa_id and uses the filterList when provided.
   */
  describe("Find User with Filter", () => {
    it("should find a specific user with the given wa_id and use the filterList when provided", async () => {
      const filterList: UsersFilterList = ["name", "whatsappProfileImage"];
      const expectedFilteredUser = {
        name: demoUserStored.name,
        whatsappProfileImage: demoUserStored.whatsappProfileImage,
      };

      // Mock the select method to resolve to the expectedFilteredUser
      (mockedUser.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValueOnce(expectedFilteredUser),
      });

      const filteredUser = await getUser(demoUserStored.wa_id, filterList);

      expect(mockedUser.findOne).toHaveBeenCalledWith({
        wa_id: demoUserStored.wa_id,
      });
      expect(logger.verbose).toHaveBeenCalledWith(
        `Find one User with the given wa_id ${demoUserStored.wa_id} completed. Document is null: false`
      );
      expect(filteredUser).toBe(expectedFilteredUser);
    });

    it("should handle errors when finding a user with filterList", async () => {
      const filterList: UsersFilterList = ["name", "whatsappProfileImage"];
      const demoError = new Error("EFATAL"); // network error

      // Mock the select method to reject with an error
      (mockedUser.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValueOnce(demoError),
      });

      const filteredUser = await getUser(demoUserStored.wa_id, filterList);

      expect(filteredUser).toBeNull();
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        wa_id: demoUserStored.wa_id,
      });
      expect(logger.verbose).not.toHaveBeenCalledWith(
        `Find one User with the given wa_id ${demoUserStored.wa_id} completed. Document is null: true`
      );
      expect(logger.error).toBeCalledWith(
        `Could not fetch user document with wa_id '${demoUserStored.wa_id}' from the database. ${demoError}`
      );
    });
  });
});
