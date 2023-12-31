// bot.on(..., messageHandler)
let onMessageHandler: (message: IListenerTextMessage) => Promise<void>;

// Mock the whatsappBot module
jest.mock("../../../../utils/whatsappBot/init", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    on: jest
      .fn()
      .mockImplementation(
        (event: SupportedWhatsappMessageTypes.TEXT, cb) =>
          (onMessageHandler = cb)
      ),
    sendTextMessage: jest.fn(),
  }),
}));

import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import logger from "../../../../logger";
import messagesController from "../../../../controllers/socketIO/chatController";
import {
  ChatSocket,
  IWhatsappTextMessageFromClient,
  UsersFilterList,
} from "../../../../app";
import demoWhatsappMessageFromClient from "../../../data/whatsapp/SocketIO/whatsappDemoMessageFromClient";
import getWhatsappBot from "../../../../utils/whatsappBot/init";
import {
  AllNamespaces,
  ClientToServerEventsMessagesType,
  ServerToClientEventsMessagesType,
} from "../../../../app";
import {
  demoListenerTextMessage,
  demoWhatsappContact,
  demoWamId,
} from "../../../data/whatsapp/REST/whatsappDemoWebhookPayload";
import {
  IListenerTextMessage,
  SupportedWhatsappMessageTypes,
} from "node-whatsapp-bot-api";
import UserModelType, { IUser } from "../../../../customTypes/models/User";

import * as UserRepositoryModule from "../../../../models/mongoDB/UserRepository";
import demoUserStored from "../../../data/whatsapp/Mongo/userStored";
import auth from "../../../../middlewares/socketIO/authMiddleware";
import { generateAccessToken } from "../../../../utils/jwt";

describe("Testing the websocket endpoint for the namespace: '/chat'", () => {
  let accessToken: string;
  const mockedGetUser = jest
    .spyOn(UserRepositoryModule, "getUser")
    .mockImplementation(jest.fn());

  const TARGET_PORT = 4500;

  const mockedBot = getWhatsappBot();
  const mockedSocketCallback = jest.fn();
  const demoOnMessages = jest.fn();
  const demoUserWAID = demoWhatsappContact.wa_id.replace("2", "1");

  let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  let serverSocket: ChatSocket;
  let clientSocket: ClientSocket<
    ServerToClientEventsMessagesType,
    ClientToServerEventsMessagesType
  >;

  beforeAll((done) => {
    const demoUserId = "<DEMO-USER-ID>";
    generateAccessToken(demoUserId).then((token) => {
      accessToken = token;

      // Set up Socket.io server for managing connections and co.
      io = new Server<
        ClientToServerEventsMessagesType,
        ServerToClientEventsMessagesType
      >(TARGET_PORT);

      // Create a new namespace and set a listener for incoming connection.
      const chatNamespace = io.of(`${AllNamespaces.CHAT}`);

      // Register auth middleware
      chatNamespace.use(auth);

      chatNamespace.on("connection", (socket) => {
        serverSocket = socket;

        // Identifies the chat the current client is in on their WhatsApp dashboard.
        // Inital value for the currentChatUser...
        serverSocket.data.currentChatUser = demoUserWAID;
        messagesController(serverSocket);
        expect(logger.info).toBeCalledWith(
          `Received a socket connection: ${serverSocket.id}.`
        );
        expect(mockedBot.on).toHaveBeenCalled();

        socket.on("messages", demoOnMessages);
      });

      // Establish a brand new socket connection
      clientSocket = Client(
        `http://localhost:${TARGET_PORT}${AllNamespaces.CHAT}`,
        {
          auth: {
            token: accessToken,
          },
        }
      );

      clientSocket.on("connect", () => {
        done();
        expect(logger.info).toBeCalledWith(
          `${demoUserId} is authenticated to establish a socket connection.`
        );
      });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("on('message')", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return void if the whatsapp message sent does not match the validation schema: ", async () => {
      const expectedValidationError = `\"text\" is not allowed to be empty`;
      const mockedWhatsappMessageFromClient: IWhatsappTextMessageFromClient = {
        ...demoWhatsappMessageFromClient,
        text: "",
      };
      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        mockedWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 500);
      });
      expect(logger.error).toBeCalledWith(
        `The validation of the received WhatsApp message failed. ${expectedValidationError}`
      );
    });

    it("should call sendTextMessage with the bot and append a new message to the user document when a message is emitted to the server", async () => {
      (mockedBot.sendTextMessage as jest.Mock).mockResolvedValueOnce(demoWamId);

      const demoUser: UserModelType = {
        name: "testosterone",
        wa_id: demoUserWAID,
        whatsapp_messages: [],
        save: jest.fn().mockResolvedValueOnce(undefined),
      } as unknown as UserModelType;
      /** It should simulate finding the document of that particular user in the database. */
      (mockedGetUser as jest.Mock).mockResolvedValueOnce(demoUser);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 500);
      });

      expect(mockedBot.sendTextMessage).toBeCalledWith(
        demoWhatsappMessageFromClient.text,
        demoWhatsappMessageFromClient.wa_id
      );
      expect(logger.info).toBeCalledWith(
        `Received a WhatsApp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
      );
      expect(logger.info).toBeCalledWith(
        `Wamid was provided back to the client.`
      );
      expect(logger.error).not.toBeCalledWith(
        `User with wa_id ${demoWhatsappMessageFromClient.wa_id} was not found. Append new WhatsApp message failed.`
      );
      expect(logger.verbose).toBeCalledWith(
        `New message was created and appended to ${demoWhatsappMessageFromClient.wa_id}.`
      );
      expect(mockedSocketCallback).toBeCalledWith(demoWamId);
      expect(demoUser.save).toBeCalled();
    });

    it("should catch the error if an error occurs during the finding of the specific user document", async () => {
      (mockedBot.sendTextMessage as jest.Mock).mockResolvedValueOnce(demoWamId);

      const demoUser: UserModelType = {
        name: "testosterone",
        wa_id: demoUserWAID,
        whatsapp_messages: [],
        save: jest.fn().mockRejectedValue(undefined),
      } as unknown as UserModelType;
      /** It should simulate finding the document of that particular user in the database. */

      const demoError = new Error("EFATAL");
      (mockedGetUser as jest.Mock).mockRejectedValueOnce(demoError);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 500);
      });
      expect(mockedBot.sendTextMessage).toBeCalledWith(
        demoWhatsappMessageFromClient.text,
        demoWhatsappMessageFromClient.wa_id
      );
      expect(logger.info).toBeCalledWith(
        `Received a WhatsApp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
      );
      expect(logger.info).toBeCalledWith(
        `Wamid was provided back to the client.`
      );
      expect(logger.error).not.toBeCalledWith(
        `User with wa_id ${demoWhatsappMessageFromClient.wa_id} was not found. Append new WhatsApp message failed.`
      );
      expect(logger.verbose).not.toBeCalledWith(
        `New message was created and appended to ${demoWhatsappMessageFromClient.wa_id}.`
      );

      // Wamid was provided.
      expect(mockedSocketCallback).toBeCalledWith(demoWamId);

      // Failed to find the user document.
      expect(logger.error).toBeCalledWith(
        `Failed to append a new WhatsApp message to ${demoWhatsappMessageFromClient.wa_id}.`
      );
      expect(demoUser.save).not.toBeCalled();
    });
    it("should catch the error if an error occurs during the saving the specific user document", async () => {
      (mockedBot.sendTextMessage as jest.Mock).mockResolvedValueOnce(demoWamId);

      const demoUser: UserModelType = {
        name: "testosterone",
        wa_id: demoUserWAID,
        whatsapp_messages: [],
        save: jest.fn().mockRejectedValue(undefined),
      } as unknown as UserModelType;
      /** It should simulate finding the document of that particular user in the database. */
      (mockedGetUser as jest.Mock).mockResolvedValueOnce(demoUser);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 500);
      });

      expect(mockedBot.sendTextMessage).toBeCalledWith(
        demoWhatsappMessageFromClient.text,
        demoWhatsappMessageFromClient.wa_id
      );
      expect(logger.info).toBeCalledWith(
        `Received a WhatsApp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
      );
      expect(logger.info).toBeCalledWith(
        `Wamid was provided back to the client.`
      );
      expect(mockedSocketCallback).toBeCalledWith(demoWamId);
      expect(logger.error).not.toBeCalledWith(
        `User with wa_id ${demoWhatsappMessageFromClient.wa_id} was not found. Append new WhatsApp message failed.`
      );
      expect(demoUser.save).toBeCalled();
      expect(logger.verbose).not.toBeCalledWith(
        `New message was created and appended to ${demoWhatsappMessageFromClient.wa_id}.`
      );
      expect(logger.error).toBeCalledWith(
        `Failed to append a new WhatsApp message to ${demoWhatsappMessageFromClient.wa_id}.`
      );
    });

    it("should call sendTextMessage with the bot when a new message is emitted to the server, but fail because no wam_id was returned", async () => {
      (mockedBot.sendTextMessage as jest.Mock).mockResolvedValueOnce(undefined);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 1000);
      });
      expect(mockedBot.sendTextMessage).toBeCalledWith(
        demoWhatsappMessageFromClient.text,
        demoWhatsappMessageFromClient.wa_id
      );
      expect(logger.error).toBeCalledWith(
        `No wamid was provided when sending textMessage to client.`
      );

      expect(logger.info).not.toBeCalledWith(
        `Wamid was provided back to the client.`
      );
      expect(mockedSocketCallback).not.toBeCalledWith(demoWamId);
    });
  });

  describe("Testing the callback function for the on bot message listener", () => {
    describe("When receiving a message from the WhatsApp bot", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it("should log a validation error if the WhatsApp text message from the bot is not valid", async () => {
        const mockListenerTextMessage: IListenerTextMessage = {
          ...demoListenerTextMessage,
          message_id: "NOT VALID",
        };
        const expectedError = `"wam_id" with value "${mockListenerTextMessage.message_id}" fails to match the required pattern: /^wamid\\..*$/`;

        await onMessageHandler(mockListenerTextMessage);

        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        expect(logger.error).toBeCalledWith(
          `Validation of incoming WhatsApp message from bot failed. ${expectedError}`
        );
      });

      it("should log verbose if 'socket.data.currentChatUser' does not match the wa_id of the received message & throw an error if userRef is not defined.", async () => {
        const expectedError = new Error("EFATAL");
        mockedGetUser.mockRejectedValueOnce(expectedError);

        const mockSetTimeout = jest.spyOn(global, "setTimeout");
        const demoQueryFilter: UsersFilterList = ["whatsappProfileImage"];

        /** It should only create a new WhatsApp message from the server when the wa_id matches. */
        await onMessageHandler(demoListenerTextMessage);
        expect(logger.verbose).toBeCalledWith(
          `Received a text message, but it is not from the currentChatUser.`
        );
        expect(mockSetTimeout).toHaveBeenCalled();
        expect(mockedGetUser).toHaveBeenCalledWith(
          demoListenerTextMessage.contact.wa_id,
          demoQueryFilter
        );
        /** It should throw an eror if the user document could not be found in the users collection*/
        expect(logger.error).toBeCalledWith(
          `An error occurred while fetching the whatsapp profile image of ${demoListenerTextMessage.contact.wa_id}. ${expectedError}`
        );
      });
      it("should throw an error if the user fetched from the database has no whatsapp profile image value: ", async () => {
        const expectedError = new Error("Whatsapp Profile image is undefined.");
        const _demoUserWithoutProfileImage: IUser = {
          ...demoUserStored,
          whatsappProfileImage: undefined as unknown as string,
        };
        mockedGetUser.mockResolvedValueOnce(
          _demoUserWithoutProfileImage as unknown as UserModelType
        );
        const mockSetTimeout = jest.spyOn(global, "setTimeout");
        const demoQueryFilter: UsersFilterList = ["whatsappProfileImage"];
        /** It should only create a new WhatsApp message from the server when the wa_id matches. */
        await onMessageHandler(demoListenerTextMessage);
        expect(logger.verbose).toBeCalledWith(
          `Received a text message, but it is not from the currentChatUser.`
        );
        expect(mockSetTimeout).toHaveBeenCalled();
        expect(mockedGetUser).toHaveBeenCalledWith(
          demoListenerTextMessage.contact.wa_id,
          demoQueryFilter
        );
        /** It should throw an eror if the user document could not be found in the users collection*/
        expect(logger.error).toBeCalledWith(
          `An error occurred while fetching the whatsapp profile image of ${demoListenerTextMessage.contact.wa_id}. ${expectedError}`
        );
      });
      it("should now throw any errors if the fetched user from the database has a valid whatsapp profile image: ", async () => {
        const expectedErrorForNoImage = new Error(
          "Whatsapp Profile image is undefined."
        );
        const expectedErrorForFailedFetch = new Error("EFATAL");
        mockedGetUser.mockResolvedValueOnce(demoUserStored as UserModelType);
        const mockSetTimeout = jest.spyOn(global, "setTimeout");
        const demoQueryFilter: UsersFilterList = ["whatsappProfileImage"];
        /** It should only create a new WhatsApp message from the server when the wa_id matches. */
        await onMessageHandler(demoListenerTextMessage);
        expect(logger.verbose).toBeCalledWith(
          `Received a text message, but it is not from the currentChatUser.`
        );
        expect(mockSetTimeout).toHaveBeenCalled();
        expect(mockedGetUser).toHaveBeenCalledWith(
          demoListenerTextMessage.contact.wa_id,
          demoQueryFilter
        );
        /** It should throw an eror if the user document could not be found in the users collection*/
        expect(logger.error).not.toBeCalledWith(
          `An error occurred while fetching the whatsapp profile image of ${demoListenerTextMessage.contact.wa_id}. ${expectedErrorForNoImage}`
        );
        /** It should throw an eror if the user document could not be found in the users collection*/
        expect(logger.error).not.toBeCalledWith(
          `An error occurred while fetching the whatsapp profile image of ${demoListenerTextMessage.contact.wa_id}. ${expectedErrorForFailedFetch}`
        );
      });
      it("should emit to the client when the chat IDs match, indicating that the user is interested in receiving the new message", async () => {
        /** It should only create a new WhatsApp message from the server when the wa_id matches. */
        const _demoListenerTextMessage: IListenerTextMessage = {
          ...demoListenerTextMessage,
          contact: {
            profile: { name: "demo" },
            wa_id: demoUserWAID,
          },
        };
        onMessageHandler(_demoListenerTextMessage);
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(undefined);
          }, 500);
        });
        expect(logger.verbose).toBeCalledWith(
          `Received a text message for the client watching the currentChatUser.`
        );
      });
    });
  });

  describe("on('chatSwitch')", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should log to the console when the user switched the chat: ", async () => {
      clientSocket.emit("chatSwitch", demoWhatsappMessageFromClient.wa_id);

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined);
        }, 500);
      });

      expect(logger.info).toBeCalledWith(
        `Socket User ${serverSocket.id} has switched the chat from ${demoUserWAID} to ${demoWhatsappMessageFromClient.wa_id}.`
      );
    });
  });

  // Put it as last test, so it does not interrupt the other tests.
  // Assuming necessary imports and configurations are already in place.

  /**
   * Test suite for socket connection related functionality.
   */
  describe("Socket connection with authMiddleware.", () => {
    const socketUrl = `http://localhost:${TARGET_PORT}${AllNamespaces.CHAT}`;

    /**
     * Test case to ensure that a socket connection attempt without providing an access token fails as expected.
     * It verifies that an error is thrown when attempting to establish a socket connection with an undefined access token.
     * Additionally, it checks that the appropriate warning logs are triggered.
     */
    it("should fail when trying to establish a socket connection without an accessToken", async () => {
      const newClientSocket = Client(socketUrl, {
        auth: {
          token: undefined,
        },
      });

      let error: Error | undefined;

      newClientSocket.on("connect_error", (err) => {
        error = err;
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      newClientSocket.close();

      expect(logger.warn).toBeCalledWith(
        "Received a socket connection request with an unspecified accessToken."
      );
      expect(error).not.toBeUndefined();
      expect((error as Error)?.message).toBe("No access token was provided.");
    });

    /**
     * Test case to ensure that a socket connection attempt with an invalid access token fails as expected.
     * It verifies that an error is thrown when attempting to establish a socket connection with an invalid access token.
     * Additionally, it checks that the appropriate warning logs are triggered.
     */
    it("should fail when trying to establish a socket connection with an invalid accessToken", async () => {
      const invalidAccessToken = "some.invalid.access.token";

      const newClientSocket = Client(socketUrl, {
        auth: {
          token: invalidAccessToken,
        },
      });

      let error: Error | undefined;

      newClientSocket.on("connect_error", (err) => {
        error = err as unknown as Error;
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      newClientSocket.close();

      expect(logger.warn).toBeCalledWith(
        "Received socket connection with an invalid access token."
      );
      expect(logger.warn).toBeCalledWith(
        "Received an invalid JWT Access token."
      );
      expect((error as Error)?.message).toBe("Unauthorized");
    });
  });

  afterAll((done) => {
    clientSocket?.disconnect();
    io.removeAllListeners();
    io.disconnectSockets();
    io.close();
    jest.restoreAllMocks();
    done();
  });
});
