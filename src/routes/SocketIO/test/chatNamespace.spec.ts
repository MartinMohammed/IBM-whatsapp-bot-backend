// bot.on(..., messageHandler)
let onMessageHandler: (message: IListenerTextMessage) => void;

// Mock the User Model

jest.mock("../../../models/mongoDB/schemas/User", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

// Mock the whatsappBot module
jest.mock("../../../utils/whatsappBot/init", () => ({
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

import mockedUserModel from "../../../models/mongoDB/schemas/User";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import logger from "../../../logger";
import messagesController from "../../../controllers/socketIO/chatController";
import { ChatSocket, IUser } from "../../../app";
import demoWhatsappMessageFromClient from "../../../testing/data/whatsapp/SocketIO/whatsappDemoMessageFromClient";
import getWhatsappBot from "../../../utils/whatsappBot/init";
import {
  AllNamespaces,
  ClientToServerEventsMessagesType,
  ServerToClientEventsMessagesType,
} from "../../../app";
import {
  demoListenerTextMessage,
  demoWhatsappContact,
  demoWamId,
} from "../../../testing/data/whatsapp/REST/whatsappDemoWebhookPayload";
import {
  IListenerTextMessage,
  SupportedWhatsappMessageTypes,
} from "node-whatsapp-bot-api";
import demoUserStored from "../../../testing/data/whatsapp/Mongo/userStored";
import UserModelType from "../../../customTypes/models/User";

describe("Testing the websocket endpoint for the namespace: '/chat'", () => {
  const TARGET_PORT = 4500;

  const mockedBot = getWhatsappBot();
  const mockedSocketCallback = jest.fn();
  const demoOnMessages = jest.fn();
  const demoUserWAID = demoWhatsappContact.wa_id.replace("2", "1");

  describe("on('message')", () => {
    let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    let serverSocket: ChatSocket;
    let clientSocket: ClientSocket<
      ServerToClientEventsMessagesType,
      ClientToServerEventsMessagesType
    >;

    beforeAll(() => {
      // Set up Socket.io server for managing connections and co.
      io = new Server<
        ClientToServerEventsMessagesType,
        ServerToClientEventsMessagesType
      >(TARGET_PORT);

      // Create a new namespace and set a listener for incoming connection.
      io.of(`${AllNamespaces.CHAT}`).on("connection", (socket) => {
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
    });

    beforeEach((done) => {
      jest.clearAllMocks();
      // Establish a brand new socket connection
      clientSocket = Client(
        `http://localhost:${TARGET_PORT}${AllNamespaces.CHAT}`
      );

      clientSocket.on("connect", () => {
        done();
      });
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
      (mockedUserModel.findOne as jest.Mock).mockResolvedValueOnce(demoUser);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(mockedBot.sendTextMessage).toBeCalledWith(
            demoWhatsappMessageFromClient.text,
            demoWhatsappMessageFromClient.wa_id
          );
          expect(logger.info).toBeCalledWith(
            `Received a whatsapp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
          );
          expect(logger.info).toBeCalledWith(
            `Wamid was provided back to the client.`
          );
          expect(logger.error).not.toBeCalledWith(
            `User with wa_id ${demoWhatsappMessageFromClient.wa_id} was not found. Append new whatsapp message failed.`
          );
          expect(logger.verbose).toBeCalledWith(
            `New message was created and appended to ${demoWhatsappMessageFromClient.wa_id}.`
          );
          expect(mockedSocketCallback).toBeCalledWith(demoWamId);
          expect(demoUser.save).toBeCalled();

          resolve(undefined);
        }, 2000);
      });
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
      (mockedUserModel.findOne as jest.Mock).mockRejectedValueOnce(demoError);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(mockedBot.sendTextMessage).toBeCalledWith(
            demoWhatsappMessageFromClient.text,
            demoWhatsappMessageFromClient.wa_id
          );
          expect(logger.info).toBeCalledWith(
            `Received a whatsapp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
          );
          expect(logger.info).toBeCalledWith(
            `Wamid was provided back to the client.`
          );
          expect(logger.error).not.toBeCalledWith(
            `User with wa_id ${demoWhatsappMessageFromClient.wa_id} was not found. Append new whatsapp message failed.`
          );
          expect(logger.verbose).not.toBeCalledWith(
            `New message was created and appended to ${demoWhatsappMessageFromClient.wa_id}.`
          );

          // Wamid was provided.
          expect(mockedSocketCallback).toBeCalledWith(demoWamId);

          // Failed to find the user document.
          expect(logger.error).toBeCalledWith(
            `Failed to append a new whatsapp message to ${demoWhatsappMessageFromClient.wa_id}.`
          );
          expect(demoUser.save).not.toBeCalled();

          resolve(undefined);
        }, 2000);
      });
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
      (mockedUserModel.findOne as jest.Mock).mockResolvedValueOnce(demoUser);

      // Mock the call with the collected serverSocket
      clientSocket.emit(
        "message",
        demoWhatsappMessageFromClient,
        mockedSocketCallback
      );

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(mockedBot.sendTextMessage).toBeCalledWith(
            demoWhatsappMessageFromClient.text,
            demoWhatsappMessageFromClient.wa_id
          );
          expect(logger.info).toBeCalledWith(
            `Received a whatsapp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
          );
          expect(logger.info).toBeCalledWith(
            `Wamid was provided back to the client.`
          );
          expect(mockedSocketCallback).toBeCalledWith(demoWamId);
          expect(logger.error).not.toBeCalledWith(
            `User with wa_id ${demoWhatsappMessageFromClient.wa_id} was not found. Append new whatsapp message failed.`
          );
          expect(demoUser.save).toBeCalled();
          expect(logger.verbose).not.toBeCalledWith(
            `New message was created and appended to ${demoWhatsappMessageFromClient.wa_id}.`
          );
          expect(logger.error).toBeCalledWith(
            `Failed to append a new whatsapp message to ${demoWhatsappMessageFromClient.wa_id}.`
          );

          resolve(undefined);
        }, 2000);
      });
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

          resolve(undefined);
        }, 1000);
      });
    });

    afterEach((done) => {
      clientSocket.close();
      done();
    });

    afterAll(async () => {
      io.close();
      io.disconnectSockets();
      jest.restoreAllMocks();
    });
  });

  describe("Testing the callback function for the on bot message listener", () => {
    let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    let serverSocket: ChatSocket;
    let clientSocket: ClientSocket<
      ServerToClientEventsMessagesType,
      ClientToServerEventsMessagesType
    >;
    beforeAll(() => {
      // Set up Socket.io server for managing connections and more.
      io = new Server<
        ClientToServerEventsMessagesType,
        ServerToClientEventsMessagesType
      >(TARGET_PORT);

      // Create a new namespace and set a listener for incoming connection.
      io.of(`${AllNamespaces.CHAT}`).on("connection", (socket) => {
        serverSocket = socket;
        // Identify the chat the current client is in on their WhatsApp dashboard.
        serverSocket.data.currentChatUser = demoUserWAID;
        messagesController(serverSocket);
        expect(logger.info).toBeCalledWith(
          `Received a socket connection: ${serverSocket.id}.`
        );
        expect(mockedBot.on).toHaveBeenCalled();

        socket.on("messages", demoOnMessages);
      });
    });

    beforeEach((done) => {
      jest.clearAllMocks();
      // Establish a brand new socket connection.
      clientSocket = Client(
        `http://localhost:${TARGET_PORT}${AllNamespaces.CHAT}`
      );

      clientSocket.on("connect", () => {
        done();
      });
    });

    afterEach((done) => {
      clientSocket.close();
      done();
    });

    afterAll(async () => {
      io.close();
      io.disconnectSockets();
      jest.restoreAllMocks();
    });

    describe("When receiving a message from the WhatsApp bot", () => {
      it("should log an error if 'socket.data.currentChatUser' does not match the wa_id of the received message", () => {
        /** It should only create a new WhatsApp message from the server when the wa_id matches. */
        onMessageHandler(demoListenerTextMessage);
        expect(logger.verbose).toBeCalledWith(
          `Received a text message, but it is not from the currentChatUser.`
        );

      });

      it("should emit to the client when the chat IDs match, indicating that the user is interested in receiving the new message", () => {
        /** It should only create a new WhatsApp message from the server when the wa_id matches. */
        const _demoListenerTextMessage: IListenerTextMessage = {
          ...demoListenerTextMessage,
          contact: {
            profile: { name: "demo" },
            wa_id: demoUserWAID,
          },
        };
        onMessageHandler(_demoListenerTextMessage);
        expect(logger.verbose).toBeCalledWith(
          `Received a text message for the client watching the currentChatUser.`
        );
      });
    });
  });
  describe("When the user switches the chat", () => {
    it.todo(
      "should update the 'serverSocket.data.currentChatUser' when a chat switch event is emitted"
    );
  });
});
