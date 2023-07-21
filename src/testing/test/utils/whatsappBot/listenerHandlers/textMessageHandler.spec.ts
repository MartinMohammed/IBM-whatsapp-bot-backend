import mongoose from "mongoose";
import User from "../../../../../models/mongoDB/schemas/User";
import { getUser } from "../../../../../models/mongoDB/UserRepository";
import toTitleCase from "../../../../../utils/toTitleCase";
import mockLogger from "../../../../../logger";
import IUser from "../../../../../customTypes/models/User";
import {
  demoWhatsappContact,
  demoListenerTextMessage,
} from "../../../../data/whatsapp/REST/whatsappDemoWebhookPayload";
import demoWhatsappMessageStored from "../../../../data/whatsapp/Mongo/whatsappMessageStored";
import { textMessageHandler } from "../../../../../utils/whatsappBot/listenerHandlers/textMessageHandler";

describe("textMessageHandler", () => {
  /**
   * Before starting the tests, make sure a db connection has been established.
   */
  beforeAll(async () => {
    // Establish connection to db for this test suite
    const mongoUri = `mongodb://mongo:27017/testDb`;
    await mongoose.connect(mongoUri);
  });

  /**
   * Clear the 'users' collection and reset mocks before each test.
   */
  beforeEach(async () => {
    // Wipe out the 'users' collection.
    await User.deleteMany();
    const userRefs = await User.find();
    expect(userRefs.length).toBe(0);
    jest.clearAllMocks();
  });

  /**
   * Test suite: when a new user is encountered.
   */
  describe("when a new user is encountered", () => {
    /**
     * Test case: should create a new user in the database with a title case name and append the first message.
     */
    it("should create a new user in the database with a title case name and append the first message", async () => {
      // User should not exist yet.
      let expectedUserRef = await getUser(demoWhatsappContact.wa_id);
      expect(expectedUserRef).toBeNull();

      const { contact } = demoListenerTextMessage;
      const newContact = {
        ...contact,
        profile: {
          name: toTitleCase(
            demoWhatsappContact.profile.name.toLocaleLowerCase()
          ),
        },
      };

      await textMessageHandler({
        ...demoListenerTextMessage,
        contact: newContact,
      });

      // User should be created after sending a message from an unstored user.
      expectedUserRef = await getUser(demoWhatsappContact.wa_id);

      expect(expectedUserRef).not.toBeNull();
      expect(expectedUserRef?.wa_id).toBe(demoWhatsappContact.wa_id);
      expect(expectedUserRef?.whatsapp_messages.length).toBe(1);
      expect(expectedUserRef?.whatsapp_messages[0].sentByClient).toEqual(true);
      expect(mockLogger.info).toBeCalledWith(
        `Successfully created a new user (${demoWhatsappContact.wa_id}) in the database users collection`
      );
      expect(expectedUserRef?.name).toBe(
        toTitleCase(demoWhatsappContact.profile.name.toLocaleLowerCase())
      );
    });
  });

  /**
   * Test suite: when an existing user is encountered.
   */
  describe("when an existing user is encountered", () => {
    /**
     * Test case: should append the new message to the user's array of messages.
     */
    it("should append the new message to the user's array of messages", async () => {
      // The user should be created inside the db.
      const user: IUser = new User({
        whatsapp_messages: [demoWhatsappMessageStored],
        name: demoWhatsappContact.profile.name,
        wa_id: demoWhatsappContact.wa_id,
      });

      // Save the user in the db.
      await user.save();

      // Represent only a static snapshot.
      const userRef = await getUser(demoWhatsappContact.wa_id);

      // The user should already exist.
      expect(userRef).not.toBeNull();

      // A new message should be appended to the user's whatsapp messages list.
      await textMessageHandler(demoListenerTextMessage);

      const userRefUpdated = await getUser(demoWhatsappContact.wa_id);

      expect(userRefUpdated?.whatsapp_messages.length).toBe(2);
      expect(userRefUpdated?.whatsapp_messages[1].sentByClient).toBe(true);
      expect(mockLogger.info).toBeCalledWith(
        `User ${demoWhatsappContact.wa_id} does already exists.`
      );
    });
  });

  /**
   * Clear the 'users' collection after each test.
   */
  afterEach(async () => {
    // Wipe out the 'users' collection.
    await User.deleteMany();
  });

  /**
   * Close the connection and restore mocks after all tests.
   */
  afterAll(async () => {
    // Close the connection
    await mongoose.disconnect();
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });
});
