import mongoose from "mongoose";
import mockLogger from "../../../../logger";
import User from "../../../../models/mongoDB/schemas/User";
import { textMessageHandler } from "../textMessageHandler";
import IUser from "../../../../customTypes/models/User";
import {
  demoUser,
  demoListenerTextMessage,
  demoWhatsappMessage,
} from "../../../../testing/data/whatsapp/whatsappDemoWebhookPayload";

describe("textMessageHandler", () => {
  // Before starting the tests, make sure a db connection has been established.
  beforeAll(async () => {
    // Establish connection to db for this test suite
    const mongoUri = `mongodb://test:test@mongo:27017/?authMechanism=DEFAULT`;
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
    it("should create a new user in the database", async () => {
      // User should not exist yet.
      let expectedUserRef = await User.findOne({ wa_id: demoUser.wa_id });
      expect(expectedUserRef).toBeNull();

      await textMessageHandler(demoListenerTextMessage);
      expectedUserRef = await User.findOne({ wa_id: demoUser.wa_id });

      expect(expectedUserRef).not.toBeNull();
      expect(expectedUserRef?.wa_id).toBe(demoUser.wa_id);
      expect(mockLogger.info).toBeCalledWith(
        `Successful created a new user(${demoUser.wa_id}) in the database users collection`
      );
    });
  });

  describe("when an existing user is encountered", () => {
    it("should append the new message to the user's array of messages", async () => {
      // The user should be created inside the db.
      const user: IUser = new User({
        whatsapp_messages: [demoWhatsappMessage],
        name: demoUser.name,
        wa_id: demoUser.wa_id,
      });

      // Save the user in the db.
      await user.save();

      const userRef = await User.findOne({ wa_id: demoUser.wa_id });

      // The user should already exist.
      expect(userRef).not.toBeNull();

      await textMessageHandler(demoListenerTextMessage);

      expect(userRef?.whatsapp_messages.length).toBe(1);
      expect(userRef?.whatsapp_messages[0].wam_id).toBe(
        demoListenerTextMessage.message_id
      );
      expect(mockLogger.info).toBeCalledWith(
        `User ${demoUser.wa_id} does already exists.`
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
