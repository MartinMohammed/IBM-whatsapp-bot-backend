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
    // Connect to test db
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
  // Test the '/api/users' endpoint
  describe(`Testing the '/api/users' endpoint`, () => {
    it("should respond with a '200' HTTP status code and retrieve all users from the users collection", async () => {
      // Send a GET request to the '/api/users' endpoint
      const response = await supertestRequest(app).get(BASE_URL);

      // Extract the received users from the response body
      let receivedUsers: UserModelType[] = response.body;

      // Verify that the response has a '200' HTTP status code
      expect(response.status).toBe(200);

      // Fetch all users from the database
      const expectedUsers = await User.find({})
        .select(["name", "wa_id", "whatsapp_messages", "_id"])
        .lean();

      // Verify that the expected users match the received users
      receivedUsers.forEach((user, index) => {
        expect(user.wa_id).toBe(expectedUsers[index].wa_id);
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
          const response = await supertestRequest(app).get(
            `${BASE_URL}?fields=${filterString}`
          );
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
        const response = await supertestRequest(app).get(
          `${BASE_URL}?fields=${filterString}`
        );

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
    const wamIdOfSentMessage = demoWamId;

    it("should append a new WhatsApp message to the user's WhatsApp message array", async () => {
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
        `Successfully appended new WhatsApp message to the user's array.`
      );
      expect(response.statusCode).toBe(200);
    });
  
    it("should fail when trying to add a WhatsApp message with a length of 0", async () => {
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
  

    it("should throw an error if the sendTextMessage function of the WhatsApp bot didn't provide a wam_id", async () => {
      mockedSendTextMessage.mockResolvedValueOnce(undefined);

     
    // WhatsApp bot didn't provide a wam_id but also didn't fail.
    const response = await supertestRequest(app)
    .post(`${BASE_URL}/${waidOfUser}/messages`)
    .send({
      text: demoWhatsappMessageFromClient.text,
    });


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
