import mongoose from "mongoose";
import mockLogger from "../../../../logger";
import User from "../../../../models/mongoDB/schemas/User";
import { textMessageHandler } from "../textMessageHandler";
import IUser from "../../../../customTypes/models/User";
import {
  demoWhatsappContact,
  demoListenerTextMessage,
} from "../../../../testing/data/whatsapp/REST/whatsappDemoWebhookPayload";
import demoWhatsappMessageStored from "../../../../testing/data/whatsapp/Mongo/whatsappMessageStored";

describe("textMessageHandler", () => {
  // Before starting the tests, make sure a db connection has been established.
  beforeAll(async () => {
    // Establish connection to db for this test suite
    const mongoUri = `mongodb://mongo:27017/users`;
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Wipe out the 'users' collection.
    await User.deleteMany();
    const userRefs = await User.find();
    expect(userRefs.length).toBe(0);
    jest.clearAllMocks();
  });

  describe("when a new user is encountered", () => {
    it("should create a new user in the database and append the first message.", async () => {
      // User should not exist yet.
      let expectedUserRef = await User.findOne({ wa_id: demoWhatsappContact.wa_id });
      expect(expectedUserRef).toBeNull();

      await textMessageHandler(demoListenerTextMessage);

      // User should be created after sending message from a unstored user.
      expectedUserRef = await User.findOne({ wa_id: demoWhatsappContact.wa_id });

      expect(expectedUserRef).not.toBeNull();
      expect(expectedUserRef?.wa_id).toBe(demoWhatsappContact.wa_id);
      expect(expectedUserRef?.whatsapp_messages.length).toBe(1)
      expect(expectedUserRef?.whatsapp_messages[0].sentByClient).toEqual(true)
      expect(mockLogger.info).toBeCalledWith(
        `Successful created a new user(${demoWhatsappContact.wa_id}) in the database users collection`
      );
    });
  });

  describe("when an existing user is encountered", () => {
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
      const userRef = await User.findOne({ wa_id: demoWhatsappContact.wa_id });

      // The user should already exist.
      expect(userRef).not.toBeNull();

      // A new message should be appeneded to the users whatsapp messages list. 
      await textMessageHandler(demoListenerTextMessage);

      const userRefUpdated = await User.findOne({ wa_id: demoWhatsappContact.wa_id });

      expect(userRefUpdated?.whatsapp_messages.length).toBe(2);
      expect(userRefUpdated?.whatsapp_messages[1].sentByClient).toBe(true)
      expect(mockLogger.info).toBeCalledWith(
        `User ${demoWhatsappContact.wa_id} does already exists.`
      );
    });
  });

  afterEach(async () => {
    // Wipe out the 'users' collection.
    await User.deleteMany();
  });

  afterAll(async () => {
    // Close the connection
    await mongoose.disconnect();
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });
});
