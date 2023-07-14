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
import User from "../../../models/mongoDB/schemas/User";
import demoWhatsappMessageFromClient from "../../../testing/data/whatsapp/SocketIO/whatsappDemoMessageFromClient";
import demoWhatsappMessageStored from "../../../testing/data/whatsapp/Mongo/whatsappMessageStored";
import {
  demoWhatsappContact,
  demoWamId,
} from "../../../testing/data/whatsapp/REST/whatsappDemoWebhookPayload";
import UserModelType from "../../../customTypes/models/User";
import getWhatsappBot from "../../../utils/whatsappBot/init";
import logger from "../../../logger";
import demoUserStored from "../../../testing/data/whatsapp/Mongo/userStored";

const BASE_URL = "/api/users";
describe("Give the http requests to the 'userRouter'", () => {
  let initialUser: UserModelType;
  let waidOfUser: string;
  const mockedWhatsappBot = getWhatsappBot() as jest.Mocked<any>;
  const mockedSendTextMessage = jest.fn();
  mockedWhatsappBot.sendTextMessage.mockImplementation(mockedSendTextMessage);

  beforeAll(async () => {
    // Instantiate MongoMemorySever
    const mongoUri = "mongodb://mongo:27017/users";
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    //   Make sure some a demo user is created
    initialUser = new User({
      whatsapp_messages: [demoWhatsappMessageStored],
      name: demoWhatsappContact.profile.name,
      wa_id: demoWhatsappContact.wa_id,
    });
    // Get the document id of the demo user.
    waidOfUser = initialUser.wa_id.toString();

    await initialUser.save();
  });

  // Test the endpoint with a GET request
  describe(`Test the '/api/users' endpoint: `, () => {
    it("should respond with '200' HTTP status code and all the users that are stored in the users collection.", async () => {
      const response = await supertestRequest(app).get(BASE_URL);
      let receivedUsers: UserModelType[] = response.body;

      expect(response.status).toBe(200);

      const expectedUsers = await User.find({})
        .select(["name", "wa_id", "whatsapp_messages", "_id"])
        .lean();

      expect(logger.info).toBeCalledWith(
        "Successfully retrieved all users from the database."
      );
      receivedUsers.forEach((user, index) => {
        expect(user.wa_id).toBe(expectedUsers[index].wa_id);
      });

      expect(logger.verbose).toBeCalledWith(
        `No field filters for the '/users' endpoint were provided.`
      );
    });

    describe("Test the '/api/users' endpoint with custom field filter through 'fields' query parameter: ", () => {
      it("should return only the requested fields including the Object id: ", async () => {
        for (const key of Object.keys(demoUserStored)) {
          const filterString = `${key},`;
          const response = await supertestRequest(app).get(
            `${BASE_URL}?fields=${filterString}`
          );
          const receivedUsers: UserModelType[] = response.body;

          expect(Object.keys(receivedUsers[0]).length).toEqual(1 + 1); // Object id + requested field
          expect(key in receivedUsers[0]).toBeTruthy();
          expect(logger.verbose).toBeCalledWith(
            `Field filters for the '/users' endpoint were provided: ${filterString}.`
          );
        }
      });

      it("should filter invalid filterItems and log error: ", async () => {
        const filterString = `name,invalid_field`;
        const response = await supertestRequest(app).get(
          `${BASE_URL}?fields=${filterString}`
        );
        const receivedUsers: UserModelType[] = response.body;

        // _id & name 
        expect(Object.keys(receivedUsers[0]).length).toEqual(1 + 1); 
        expect(logger.error).toBeCalledWith(
          `A invalid filterItem was added when request to '/api/users: '${`invalid_field`}'.`
        );
        expect("name" in receivedUsers[0]).toBeTruthy()
      })

      afterEach(() => {
        expect(logger.verbose).not.toBeCalledWith(
          `No field filters for the /users endpoint were provided.`
        );
        jest.clearAllMocks();
      });
    });
  });

  describe("Test the '/api/users/:userId/messages' endpoint: ", () => {
    const wamIdOfSentMessage = demoWamId;

    it("should append a new whatsapp_message to the user's whatsapp message array.", async () => {
      mockedSendTextMessage.mockResolvedValueOnce(wamIdOfSentMessage);

      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${waidOfUser}/messages`)
        .send({
          text: demoWhatsappMessageFromClient.text,
        });

      expect(logger.verbose).toHaveBeenCalledWith(
        `Find one User with the given wa_id ${
          demoWhatsappMessageFromClient.wa_id
        } completed. Document is null: ${false}`
      );

      expect(mockedSendTextMessage).toBeCalledWith(
        demoWhatsappMessageFromClient.text,
        demoWhatsappMessageFromClient.wa_id
      );

      expect(logger.info).toHaveBeenLastCalledWith(
        `Successfully appended new whatsapp message to the users array.`
      );
      expect(response.statusCode).toBe(200);
    });

    it("should fail when trying to add a whatsapp message with the length of 0", async () => {
      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${waidOfUser}/messages`)
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

    it("should respond with status code 500 if the user document could not be found", async () => {
      mockedSendTextMessage.mockResolvedValue(wamIdOfSentMessage);

      const mockUserId = waidOfUser.replace("1", "2");
      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${mockUserId}/messages`)
        .send({
          text: demoWhatsappMessageFromClient.text,
        });

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(logger.error).toBeCalledWith(
            `Document of user with wa_id ${mockUserId} not found in the database.`
          );

          expect(response.statusCode).toBe(500);
          expect(response.body).toEqual({
            message: "Document not found in the database.",
          });
          resolve(undefined);
        }, 3000);
      });
    });

    it("should throw an error if the sendTextMessage function of the whatsapp bot didn't provide a wam_id", async () => {
      mockedSendTextMessage.mockResolvedValueOnce(undefined);

      // Whatsapp bot didn't provide a wam_id but also didn't failed.
      const response = await supertestRequest(app)
        .post(`${BASE_URL}/${waidOfUser}/messages`)
        .send({
          text: demoWhatsappMessageFromClient.text,
        });

      // it should find the user document
      expect(logger.verbose).toBeCalledWith(
        `Find one User with the given wa_id ${
          demoWhatsappMessageFromClient.wa_id
        } completed. Document is null: ${false}`
      );
      expect(logger.info).not.toBeCalledWith(
        `Successfully appended new whatsapp message to the users array.`
      );
      expect(logger.warn).toBeCalledWith(
        "Whatsapp Bot has not provided a wam_id for the message it sent."
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: "Failed to send text message with whatsappbot.",
      });
    });

    afterEach(async () => {
      await User.deleteMany();
      jest.clearAllMocks();
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
