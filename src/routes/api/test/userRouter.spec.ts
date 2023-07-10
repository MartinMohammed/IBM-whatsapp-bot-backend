// Mock the whatsappBot module
jest.mock("../../../utils/whatsappBot/init", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    sendTextMessage: jest.fn(),
  }),
}));

import supertestRequest from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../../models/mongoDB/schemas/User";
import { demoWhatsappMessage } from "../../../testing/data/whatsapp/whatsappDemoWebhookPayload";
import { demoUser } from "../../../testing/data/whatsapp/whatsappDemoWebhookPayload";
import IUser from "../../../models/mongoDB/types/User";
import getWhatsappBot from "../../../utils/whatsappBot/init";
import logger from "../../../logger";

const BASE_URL = "/api/users";
describe("Give the http requests to the 'userRouter'", () => {
  let initialUser: IUser;
  let userId: string;
  const mockedWhatsappBot = getWhatsappBot() as jest.Mocked<any>;
  const mockedSendTextMessage = jest.fn();
  mockedWhatsappBot.sendTextMessage.mockImplementation(mockedSendTextMessage);

  beforeAll(async () => {
    // Instantiate MongoMemorySever
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    //   Make sure some a demo user is created
    initialUser = new User({
      whatsapp_messages: [demoWhatsappMessage],
      name: demoUser.name,
      wa_id: demoUser.wa_id,
    });
    // Get the document id of the demo user.
    userId = initialUser._id.toString();

    await initialUser.save();
  });

  // Test the endpoint with a GET request
  describe(`Test the '${BASE_URL}' endpoint: `, () => {
    it("should respond with '200' HTTP status code and all the users that are stored in the users collection.", async () => {
      const response = await supertestRequest(app).get(BASE_URL);
      let receivedUsers: IUser[] = response.body;

      expect(response.status).toBe(200);

      const expectedUsers = await User.find({})
        .select(["name", "wa_id", "whatsapp_messages", "_id"])
        .lean();

      receivedUsers.forEach((user, index) => {
        expect(user.wa_id).toBe(expectedUsers[index].wa_id);
      });
    });
  });

  describe("Test the '/api/users/:userId/messages' endpoint: ", () => {
    const wamIdOfSentMessage =
      "wamid.HBgMNDkxNzk0NjYxMzUwFQIAEhgUM0E1QzYyMjQ5OTcwOUI3RDg0Q0aa";

    it("should a new message appended to the users whatsapp messages array: ", async () => {
      mockedSendTextMessage.mockResolvedValueOnce(wamIdOfSentMessage);

      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${userId}/messages`)
        .send({
          text: demoWhatsappMessage.text,
        });

      expect(mockedSendTextMessage).toBeCalledWith(
        demoWhatsappMessage.text,
        demoWhatsappMessage.wa_id
      );
      expect(logger.info).toHaveBeenLastCalledWith(
        `Successfully appended new whatsapp message to the users array.`
      );
      expect(response.statusCode).toBe(200);
    });

    it("should fail when trying to add a whatsapp message with the length of 0", async () => {
      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${userId}/messages`)
        .send({
          text: "", // empty
        });

      expect(logger.warn).toBeCalledWith(
        `Text message is not allowed to have a length of 0`
      );
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: `Text message is not allowed to have a length of 0`,
      });
    });

    it("should respond with status code 500, if the user document could not be found: ", async () => {
      mockedSendTextMessage.mockResolvedValue(wamIdOfSentMessage);

      const mockUserId = userId.replace("a", "b");
      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${mockUserId}/messages`)
        .send({
          text: demoWhatsappMessage.text,
        });

      expect(logger.error).toBeCalledWith(
        `Document ${mockUserId} not found in the database.`
      );

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: "Document not found in the database.",
      });
    });

    it("should throw an error if the sendTextMessage function of the whatsapp bot didn't provide a wam_id", async () => {
      mockedSendTextMessage.mockResolvedValueOnce(undefined);

      // Whatsapp bot didn't provide a wam_id but also didn't failed.
      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${userId}/messages`)
        .send({
          text: demoWhatsappMessage.text,
        });

      // it should find the user document
      expect(logger.verbose).toBeCalledWith(
        `Successfully retrieved user document from db.`
      );
      expect(logger.error).not.toBeCalledWith(
        `Document ${userId} not found in the database.`
      );
      expect(logger.warn).toBeCalledWith(
        "Whatsapp Bot has not provided a wam_id for the message it sent."
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: "Failed to send text message with whatsappbot.",
      });
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close the connection:
    await mongoose.disconnect();
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });
});
