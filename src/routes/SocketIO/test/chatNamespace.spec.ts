// bot.on(..., messageHandler)
let onMessageHandler: (message: IListenerTextMessage) => void;

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

import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import logger from "../../../logger";
import messagesController from "../../../controllers/socketIO/chatController";
import { ChatSocket } from "../../../app";
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

describe("Testing the websocket endpoint for the namespace: '/chat'", () => {
  const TARGET_PORT = 4500;
  let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  let serverSocket: ChatSocket;
  let clientSocket: ClientSocket<
    ServerToClientEventsMessagesType,
    ClientToServerEventsMessagesType
  >;
  const mockedBot = getWhatsappBot();
  const mockedSocketCallback = jest.fn();
  const demoOnMessages = jest.fn();
  const demoUserWAID = demoWhatsappContact.wa_id.replace("2", "1");
  beforeAll(() => {
    // Set up Socket.io server for managing connections and co.
    io = new Server<
      ClientToServerEventsMessagesType,
      ServerToClientEventsMessagesType
    >(TARGET_PORT);

    // Create a new namespace and set a listener for incoming connection.
    io.of(`${AllNamespaces.CHAT}`).on("connection", (socket) => {
      serverSocket = socket;
      // Identifies in which chat the current client is in his whatsapp dashboard.
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

  it("should call sendTextMessage with the bot when a message is emitted to the server", async () => {
    (mockedBot.sendTextMessage as jest.Mock).mockResolvedValueOnce(demoWamId);

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
        resolve(undefined);
      }, 1000);
    });
  });

  it("should call sendTextMessage with the bot when a new message is emitted to the server, but then fail because no wam_id was returned", async () => {
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

  describe("Testing the 'on' event handler inside the messagesController with a given socket connection: ", () => {
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

    it("should log an error if 'socket.data.currentChatUser' does not match the wa_id of the received message from the whatsapp bot: ", () => {
      /** It should only create a new whatsappMessageFrom Server when wa_id matches  */
      onMessageHandler(demoListenerTextMessage);
      expect(logger.verbose).toBeCalledWith(
        `Received a text message but is not the currentChatUser.`
      );
    });

    it("should emit to the client, because the chat-ids do match and thus the user is interested to receive the new message: ", () => {
      /** It should only create a new whatsappMessageFrom Server when wa_id matches  */
      const _demoListenerTextMessage: IListenerTextMessage = {
        ...demoListenerTextMessage,
        contact: {
          profile: { name: "demo" },
          wa_id: demoUserWAID,
        },
      };
      onMessageHandler(_demoListenerTextMessage);
      expect(logger.verbose).toBeCalledWith(
          `Received a text message for the client watching on currentChatUser.`
      );
    });

    afterEach((done) => {
      clientSocket.close();
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
});
