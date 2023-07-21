// Mock the whatsappBot module
jest.mock("../../../../utils/whatsappBot/init", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    sendTextMessage: jest.fn(),
  }),
}));

import mongoose from "mongoose";
import supertestRequest from "supertest";
import logger from "../../../../logger";
import app, { IWhatsappMessage } from "../../../../app";
import User from "../../../../models/mongoDB/schemas/User";
import demoWhatsappMessageFromClient from "../../../data/whatsapp/SocketIO/whatsappDemoMessageFromClient";
import demoWhatsappMessageStored from "../../../data/whatsapp/Mongo/whatsappMessageStored";
import {
  demoWhatsappContact,
  demoWamId,
} from "../../../data/whatsapp/REST/whatsappDemoWebhookPayload";
import UserModelType from "../../../../customTypes/models/User";
import getWhatsappBot from "../../../../utils/whatsappBot/init";
import demoUserStored from "../../../data/whatsapp/Mongo/userStored";
import createHttpError from "http-errors";
import getUnixTimestamp from "../../../../utils/getUnixTimestamp";
import { generateAccessToken } from "../../../../utils/jwt";

const BASE_URL = "/api/users";
describe("Give the http requests to the 'userRouter'", () => {
  let initialUser: UserModelType;
  let waidOfUser: string;
  const mockedWhatsappBot = getWhatsappBot() as jest.Mocked<any>;
  const mockedSendTextMessage = jest.fn();
  mockedWhatsappBot.sendTextMessage.mockImplementation(mockedSendTextMessage);
  let demoAccessToken: string;

  beforeAll(async () => {
    // Connect to test db
    const mongoUri = "mongodb://mongo:27017/testDb";
    demoAccessToken = await generateAccessToken("<DEMO_USER_ID>");
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    //   Make sure some a new demo user is created
    initialUser = new User({
      whatsapp_messages: [demoWhatsappMessageStored],
      name: demoWhatsappContact.profile.name,
      wa_id: demoWhatsappContact.wa_id,
    });
    // Get the document id of the demo user.
    waidOfUser = initialUser.wa_id;

    await initialUser.save();
  });
  // Test the '/api/users' endpoint
  describe(`Testing the '/api/users' endpoint`, () => {
    it("should fail if no bearer token was provided: ", async () => {
      const expectedError = createHttpError.Unauthorized("Unauthorized");

      // Send a GET request to the '/api/users' endpoint
      const response = await supertestRequest(app).get(BASE_URL);
      expect(response.statusCode).toBe(expectedError.statusCode);
      expect(response.body?.error?.message).toBe(expectedError.message);
      expect(response.body?.error?.statusCode).toBe(expectedError.statusCode);
    });
    it("should respond with a '200' HTTP status code and retrieve all users from the users collection", async () => {
      // Send a GET request to the '/api/users' endpoint
      const response = await supertestRequest(app)
        .get(BASE_URL)
        .set("Authorization", `Bearer ${demoAccessToken}`);

      // Extract the received users from the response body
      let receivedUsers: UserModelType[] = response.body;

      // Verify that the response has a '200' HTTP status code
      expect(response.status).toBe(200);

      const queryFilter: (keyof UserModelType)[] = [
        "name",
        "wa_id",
        "whatsapp_messages",
        "_id",
        "whatsappProfileImage",
      ];
      // Fetch all users from the database
      const expectedUsers = await User.find({}).select(queryFilter).lean();

      // Verify that the expected users match the received users
      receivedUsers.forEach((user, index) => {
        expect(user.wa_id).toBe(expectedUsers[index].wa_id);
        // Check if all required fields are included in each user.
        expect(queryFilter[index] in user).toBeTruthy();
      });

      // Verify that the appropriate logs were made
      expect(logger.info).toBeCalledWith(
        "Successfully retrieved all users from the database."
      );

      expect(logger.verbose).toBeCalledWith(
        `No field filters for the '/users' endpoint were provided.`
      );
    });

    describe("Testing the '/api/users' endpoint with custom field filter through the 'fields' query parameter", () => {
      it("should return only the requested fields, including the Object ID", async () => {
        for (const key of Object.keys(demoUserStored)) {
          const filterString = `${key},`;
          const response = await supertestRequest(app)
            .get(`${BASE_URL}?fields=${filterString}`)
            .set("Authorization", `Bearer ${demoAccessToken}`);
          const receivedUsers: UserModelType[] = response.body;

          // Assertion: The response should contain only the requested field and the Object ID
          expect(Object.keys(receivedUsers[0]).length).toEqual(1 + 1); // Object ID + requested field
          expect(key in receivedUsers[0]).toBeTruthy();

          // Logging: Verbose log for the field filters used
          expect(logger.verbose).toBeCalledWith(
            `Field filters for the '/users' endpoint were provided: ${filterString}.`
          );
        }
      });

      it("should filter out invalid filterItems and log an error", async () => {
        // Define a filter string with both valid and invalid filterItems
        const filterString = `name,invalid_field`;

        // Send a GET request to the API with the filter string
        const response = await supertestRequest(app)
          .get(`${BASE_URL}?fields=${filterString}`)
          .set("Authorization", `Bearer ${demoAccessToken}`);

        // Get the received users from the response body
        const receivedUsers: UserModelType[] = response.body;

        // Expect the received user objects to only contain the valid fields ('_id' and 'name')
        expect(Object.keys(receivedUsers[0]).length).toEqual(1 + 1);

        // Expect the logger to be called with an error message for the invalid filterItem
        expect(logger.error).toBeCalledWith(
          `An invalid filterItem was added when making a request to '/api/users': '${`invalid_field`}'.`
        );

        // Expect the valid field ('name') to be present in the received user object
        expect("name" in receivedUsers[0]).toBeTruthy();
      });

      it.todo(
        "should throw an error if fetching all users from the database throws an error"
      );

      afterEach(() => {
        expect(logger.verbose).not.toBeCalledWith(
          `No field filters for the /users endpoint were provided.`
        );
        jest.clearAllMocks();
      });
    });
  });

  describe("Test the '/api/users/:userId/messages' endpoint: ", () => {
    describe("Method: GET", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("should fail if no bearer token was provided: ", async () => {
        const expectedError = createHttpError.Unauthorized("Unauthorized");

        /**
         * Per default one user is created already
         * Create new users in the database.
         *  */
        // Append some new messages to the array of the default user
        const userRef = await User.findOne({
          wa_id: demoWhatsappContact.wa_id,
        });
        for (let i = 0; i < 10; i++) {
          userRef?.whatsapp_messages.push({
            ...demoWhatsappMessageStored,
            wam_id: `waid.${i}`,
          });
        }
        await userRef?.save();
        const page = 1;

        const response = await supertestRequest(app).get(
          `${BASE_URL}/${waidOfUser}/messages?page=${page}`
        );
        expect(response.statusCode).toBe(expectedError.statusCode);
        expect(response.body?.error?.message).toBe(expectedError.message);
        expect(response.body?.error?.statusCode).toBe(expectedError.statusCode);
      });

      it("should fetch only the amount of entries as the limitter has specified: ", async () => {
        /**
         * Per default one user is created already
         * Create new users in the database.
         *  */
        // Append some new messages to the array of the default user
        const userRef = await User.findOne({
          wa_id: demoWhatsappContact.wa_id,
        });
        for (let i = 0; i < 10; i++) {
          userRef?.whatsapp_messages.push({
            ...demoWhatsappMessageStored,
            wam_id: `waid.${i}`,
          });
        }
        await userRef?.save();
        const page = 1;

        const numberOfEntriesMaximumExpected = page * 10;
        const response = await supertestRequest(app)
          .get(`${BASE_URL}/${waidOfUser}/messages?page=${page}`)
          .set("Authorization", `Bearer ${demoAccessToken}`);
        const messages: IWhatsappMessage[] = response.body;
        expect(messages.length).toBeLessThanOrEqual(
          numberOfEntriesMaximumExpected
        );
        expect(response.statusCode).toBe(200);
      });

      afterAll(() => {
        User.deleteMany({});
      });
    });
    describe("Method: POST", () => {
      const wamIdOfSentMessage = demoWamId;

      it("should fail if no bearer token was provided: ", async () => {
        const expectedError = createHttpError.Unauthorized("Unauthorized");

        const response = await supertestRequest(app)
          .post(`${BASE_URL}/${waidOfUser}/messages`)
          .send({
            text: demoWhatsappMessageFromClient.text,
          });
        expect(response.statusCode).toBe(expectedError.statusCode);
        expect(response.body?.error?.message).toBe(expectedError.message);
        expect(response.body?.error?.statusCode).toBe(expectedError.statusCode);
      });

      it("should append a new WhatsApp message to the user's WhatsApp message array", async () => {
        mockedSendTextMessage.mockResolvedValueOnce(wamIdOfSentMessage);

        const response = await supertestRequest(app)
          .post(`${BASE_URL}/${waidOfUser}/messages`)
          .send({
            text: demoWhatsappMessageFromClient.text,
          })
          .set("Authorization", `Bearer ${demoAccessToken}`);

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
          `Successfully appended new WhatsApp message to the user's array.`
        );
        expect(response.statusCode).toBe(200);
      });

      it("should fail when trying to add a WhatsApp message with a length of 0", async () => {
        const response = await supertestRequest(app)
          .post(`${BASE_URL}/${waidOfUser}/messages`)
          .send({
            text: "", // empty
          })
          .set("Authorization", `Bearer ${demoAccessToken}`);

        expect(response.statusCode).toBe(422);
        expect("error" in response.body).toBeTruthy();
        expect(response?.body?.error?.message).toBe(
          '"text" is not allowed to be empty'
        );
      });
      it("should fail when trying to add data data is not asked.", async () => {
        const response = await supertestRequest(app)
          .post(`${BASE_URL}/${waidOfUser}/messages`)
          .send({
            text: demoWhatsappMessageStored.text, // empty
            timestamp: getUnixTimestamp(),
          })
          .set("Authorization", `Bearer ${demoAccessToken}`);

        expect(response.statusCode).toBe(422);
        expect("error" in response.body).toBeTruthy();
        expect(response?.body?.error?.message).toBe(
          '"timestamp" is not allowed'
        );
      });

      it("should respond with status code 500 if the user document could not be found", async () => {
        mockedSendTextMessage.mockResolvedValue(wamIdOfSentMessage);

        const mockUserId = waidOfUser.replace("1", "2");
        const expectedError = createHttpError.BadRequest(
          `Document of user with wa_id ${mockUserId} not found in the database.`
        );
        const response = await supertestRequest(app)
          .post(`${BASE_URL}/${mockUserId}/messages`)
          .send({
            text: demoWhatsappMessageFromClient.text,
          })
          .set("Authorization", `Bearer ${demoAccessToken}`);

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(undefined);
          }, 2000);

          expect(logger.error).toBeCalledWith(
            `Document of user with wa_id ${mockUserId} not found in the database.`
          );

          expect(response.statusCode).toBe(expectedError.statusCode);
          expect(response?.body?.error?.message).toEqual(expectedError.message);
          expect("error" in response.body).toBeTruthy();
        });
      });

      it("should throw an error if the sendTextMessage function of the WhatsApp bot didn't provide a wam_id", async () => {
        const expectedError = createHttpError.InternalServerError(
          "Failed to send WhatsApp message."
        );
        mockedSendTextMessage.mockResolvedValueOnce(undefined);

        // WhatsApp bot didn't provide a wam_id but also didn't fail.
        const response = await supertestRequest(app)
          .post(`${BASE_URL}/${waidOfUser}/messages`)
          .send({
            text: demoWhatsappMessageFromClient.text,
          })
          .set("Authorization", `Bearer ${demoAccessToken}`);

        // It should find the user document.
        expect(logger.verbose).toBeCalledWith(
          `Find one User with the given wa_id ${
            demoWhatsappMessageFromClient.wa_id
          } completed. Document is null: ${false}`
        );
        expect(logger.info).not.toBeCalledWith(
          `Successfully appended new WhatsApp message to the user's array.`
        );
        expect(logger.warn).toBeCalledWith(
          "WhatsApp Bot has not provided a wam_id for the message it sent."
        );

        expect(response.statusCode).toBe(expectedError.statusCode);
        expect("error" in response).toBeTruthy();
        expect(response?.body?.error?.message).toEqual(expectedError.message);
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
